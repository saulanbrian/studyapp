from typing import List, Optional
from pydantic import BaseModel


class Section(BaseModel):
    header:Optional[str]
    text:str

class SummaryModel(BaseModel):
    title:str 
    content:List[Section]
