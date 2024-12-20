from django.db import models

# Create your models here.



class RegEmpre(models.Model):


    cod_empresa = models.IntegerField(primary_key=True)

    data = models.DateField()

    faturamento = models.FloatField(null=True, blank=True)

    custo_total = models.FloatField(null= True, blank=True)

    lucro = models.FloatField(null=True, blank=True)

    rentabilidade =  models.FloatField(null=True, blank=True)

    custo_fixo_total =  models.FloatField(null=True, blank=True)

    custo_fiscal =  models.FloatField(null=True, blank=True)

    custo_dp =  models.FloatField(null=True, blank=True)

    custo_contabil =  models.FloatField(null=True, blank=True)

    class Meta:

        db_table = 'reg_empre'
        managed = False





class RegFunc(models.Model):

    nome_func = models.CharField(max_length=50)


    departamento = models.CharField(max_length=50)

    total_hora = models.FloatField(null =True, blank=True)

    tempo_ativ = models.FloatField(null=True, blank=True)

    data = models.DateField()


    class Meta:

        db_table = 'reg_func'

        managed = False


class Geempre(models.Model):

    cod_empresa = models.IntegerField()

    nome = models.CharField(max_length=50)

    class Meta:

        db_table = 'geempre'

        managed = False




