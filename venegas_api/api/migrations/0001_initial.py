# Generated by Django 5.1.4 on 2024-12-12 22:03

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='RegEmpre',
            fields=[
                ('cod_empresa', models.IntegerField(primary_key=True, serialize=False)),
                ('data', models.DateField()),
                ('faturamento', models.FloatField(blank=True, null=True)),
                ('custo_total', models.FloatField(blank=True, null=True)),
                ('lucro', models.FloatField(blank=True, null=True)),
                ('rentabilidade', models.FloatField(blank=True, null=True)),
                ('custo_fixo_total', models.FloatField(blank=True, null=True)),
                ('custo_fiscal', models.FloatField(blank=True, null=True)),
                ('custo_dp', models.FloatField(blank=True, null=True)),
                ('custo_contabil', models.FloatField(blank=True, null=True)),
            ],
            options={
                'db_table': 'reg_empre',
            },
        ),
        migrations.CreateModel(
            name='RegFunc',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nome_func', models.CharField(max_length=50)),
                ('departamento', models.CharField(max_length=50)),
                ('total_hora', models.FloatField(blank=True, null=True)),
                ('tempo_ativ', models.FloatField(blank=True, null=True)),
                ('data', models.DateField()),
            ],
        ),
    ]
