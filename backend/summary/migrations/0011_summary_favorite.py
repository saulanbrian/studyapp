# Generated by Django 5.1.7 on 2025-05-23 12:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('summary', '0010_alter_summary_options'),
    ]

    operations = [
        migrations.AddField(
            model_name='summary',
            name='favorite',
            field=models.BooleanField(default=False),
        ),
    ]
