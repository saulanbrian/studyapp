from rest_framework import serializers

from .models import Quiz, Question, Option

from django.conf import settings

class OptionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Option
        fields = ('id','option_text','is_correct')


class QuestionSerializer(serializers.ModelSerializer):


    options = serializers.SerializerMethodField()

    class Meta: 
        model = Question
        fields = (
            'id',
            'question_text',
            'options'
        )

    def get_options(self,obj):
        options = obj.options.all()
        serializer = OptionSerializer(options,many=True)
        return serializer.data 


class QuizSerializer(serializers.ModelSerializer):

    questions = serializers.SerializerMethodField()
    summary_id = serializers.SerializerMethodField()
    summary_title = serializers.SerializerMethodField()
    number_of_questions = serializers.SerializerMethodField()
    summary_cover = serializers.SerializerMethodField()


    class Meta:
        model = Quiz 
        fields = (
            'id',
            'summary_id',
            'summary_title',
            'questions',
            'status',
            'highest_score',
            'number_of_questions',
            'summary_cover'
        )


    def get_summary_id(self,obj):
        return str(obj.summary.id) 


    def get_summary_title(self,obj):
        return obj.summary.title

    def get_summary_cover(self,obj):
        if obj.summary.cover:
            return f'{settings.BASE_URL}{obj.summary.cover.url}'
        return None 


    def get_questions(self,obj):
        questions = obj.questions.all()
        serializer = QuestionSerializer(questions,many=True)
        return serializer.data

    def get_number_of_questions(self,obj):
        return obj.questions.count()
