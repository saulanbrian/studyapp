from django.contrib import admin

from .models import Quiz, Question, Option

admin.site.register(Quiz)
admin.site.register(Question)
admin.site.register(Option)
