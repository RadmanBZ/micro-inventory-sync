from __future__ import annotations

import logging
from functools import lru_cache

from google import genai
from google.genai import types
from pydantic import BaseModel, Field

from app.core.config import settings

logger = logging.getLogger(__name__)

ORDER_EXTRACTION_SYSTEM_PROMPT = """\
You are an expert e-commerce order extraction assistant for merchants in Oman and the wider GCC.

Analyze the provided Instagram direct-message chat history and extract structured order details.

Language support:
- Arabic: Omani dialect, Gulf dialects, and Modern Standard Arabic
- English: full support, including informal Gulf English

Extraction rules:
1. customer_name: the buyer's name if explicitly stated; otherwise use an empty string.
2. shipping_address: full delivery address including governorate, wilayat, area, street, \
building, and landmark details when available; otherwise use an empty string.
3. items: every distinct product mentioned with its requested quantity as a positive integer.
   - Map colloquial Arabic product names to the clearest product label.
   - If quantity is not stated, default to 1.
   - Deduplicate identical products by summing quantities.

Return only the structured JSON fields defined by the schema. Do not invent products or \
addresses that are not supported by the chat text.\
"""


class ExtractedOrderItem(BaseModel):
    product_name: str = Field(description="Product name as understood from the chat.")
    quantity: int = Field(ge=1, description="Requested quantity for the product.")


class ExtractedOrder(BaseModel):
    customer_name: str = Field(description="Customer name if mentioned in the chat.")
    shipping_address: str = Field(description="Full shipping or delivery address.")
    items: list[ExtractedOrderItem] = Field(
        default_factory=list,
        description="Line items extracted from the conversation.",
    )


@lru_cache
def _get_gemini_client() -> genai.Client:
    return genai.Client(api_key=settings.GEMINI_API_KEY)


async def extract_order_from_chat(chat_log: str) -> dict:
    """
    Send raw chat history to Gemini 2.5 Flash and return validated order JSON.

    Uses structured outputs so the response always matches the ExtractedOrder schema.
    """
    if not settings.GEMINI_API_KEY:
        logger.warning("GEMINI_API_KEY is not configured; returning empty extraction.")
        return ExtractedOrder().model_dump()

    client = _get_gemini_client()

    try:
        response = await client.aio.models.generate_content(
            model="gemini-2.5-flash",
            contents=chat_log,
            config=types.GenerateContentConfig(
                system_instruction=ORDER_EXTRACTION_SYSTEM_PROMPT,
                temperature=0.1,
                response_mime_type="application/json",
                response_schema=ExtractedOrder,
            ),
        )
    except Exception:
        logger.exception("Gemini order extraction failed.")
        return ExtractedOrder().model_dump()

    if response.parsed is not None:
        if isinstance(response.parsed, ExtractedOrder):
            return response.parsed.model_dump()
        return ExtractedOrder.model_validate(response.parsed).model_dump()

    if response.text:
        try:
            return ExtractedOrder.model_validate_json(response.text).model_dump()
        except Exception:
            logger.exception("Failed to parse Gemini JSON response.")

    return ExtractedOrder().model_dump()
