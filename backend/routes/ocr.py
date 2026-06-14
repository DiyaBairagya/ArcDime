import os
import shutil

from fastapi import APIRouter, File, HTTPException, UploadFile

from schemas import OCRParseRequest
from services.ocr_service import extract_text_from_image, parse_expense_from_ocr_text

router = APIRouter(prefix="/ocr", tags=["OCR"])


@router.post("/extract-text")
async def extract_text_from_bill(file: UploadFile = File(...)):
    allowed_types = ["image/jpeg", "image/png", "image/jpg"]

    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail="Only JPG and PNG images are supported"
        )

    upload_dir = "uploads"
    os.makedirs(upload_dir, exist_ok=True)

    file_path = os.path.join(upload_dir, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        extracted_text, extracted_lines = extract_text_from_image(file_path)
        parsed_expense = parse_expense_from_ocr_text(extracted_text)

        return {
            "filename": file.filename,
            "extracted_text": extracted_text,
            "line_count": len(extracted_lines),
            "parsed_expense": parsed_expense
        }

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"OCR processing failed: {str(error)}"
        )


@router.post("/parse-expense")
def parse_ocr_expense(request: OCRParseRequest):
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="OCR text cannot be empty")

    return parse_expense_from_ocr_text(request.text)