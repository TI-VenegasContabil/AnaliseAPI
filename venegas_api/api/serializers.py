from rest_framework import serializers
from .models import RegEmpre, RegFunc, Geempre


class RegEmpreSerializer(serializers.ModelSerializer):

    class Meta:

        model = RegEmpre

        fields = (
            'cod_empresa',
            'data',
            'faturamento',
            'custo_total',
            'lucro',
            'rentabilidade',
            'custo_fixo_total',
            'custo_fiscal',
            'custo_dp',
            'custo_contabil',
        )


class RegFuncSerializer(serializers.ModelSerializer):

    class Meta:

        model = RegFunc

        fields = (
            'nome_func', 
            'departamento', 
            'total_hora', 
            'tempo_ativ', 
            'data', 
        )


class GeempreSerializer(serializers.ModelSerializer):

    class Meta:

        model = Geempre

        fields = (
            'cod_empresa',
            'nome'
        )