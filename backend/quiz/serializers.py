from rest_framework import serializers

from .models import Quiz, Question, Option


class OptionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Option
        fields = ('option_text','is_correct')


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


    class Meta:
        model = Quiz 
        fields = (
            'id',
            'summary_id',
            'summary_title',
            'questions'
        )


    def get_summary_id(self,obj):
        return obj.summary.id 


    def get_summary_title(self,obj):
        return obj.summary.title


    def get_questions(self,obj):
        questions = obj.questions.all()
        serializer = QuestionSerializer(questions,many=True)
        return serializer.data
