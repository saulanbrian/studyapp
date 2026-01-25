from typing import Literal, TypedDict
from pydantic import BaseModel


class Question(BaseModel):
    question:str

class Choice(BaseModel):
    is_correct:bool


#Choice Types
class TrueOrFalseOption(Choice):
    value:bool

class MultipleChoiceOption(Choice):
    text:str


#Question Types
class TrueOrFalseQuestion(Question):
    type:Literal["true_or_false"]
    choices:list[TrueOrFalseOption]


class MultipleChoiceQuestion(Question):
    type:Literal["multiple_choice"]
    choices:list[MultipleChoiceOption]

 

class QuizModel(BaseModel):
    questions:list[TrueOrFalseQuestion | MultipleChoiceQuestion]



