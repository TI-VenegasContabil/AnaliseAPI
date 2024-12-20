
from rest_framework import generics

from .models import RegEmpre, RegFunc, Geempre

from .serializers import RegEmpreSerializer, RegFuncSerializer, GeempreSerializer

from rest_framework.generics import get_object_or_404

from rest_framework import viewsets , mixins

from rest_framework.decorators import action

from rest_framework.response import Response


from rest_framework import status

from datetime import date, datetime

import pandas as pd

import numpy as np

from  django.http import JsonResponse

class RegEmpreViewSet(viewsets.ModelViewSet):

    queryset =RegEmpre.objects.all()

    serializer_class = RegEmpreSerializer


    @action(detail=False,methods=['GET'])

    def search(self, request):

        cod_empresa = request.query_params.get('cod_empresa', None)

        if not cod_empresa:
            

            return Response(status=status.HTTP_400_BAD_REQUEST)
        

        try:
            cod_empresa = int(cod_empresa)

        except ValueError:

            return Response(status= status.HTTP_400_BAD_REQUEST)
        


        registros = RegEmpre.objects.filter(cod_empresa = cod_empresa)

        if not registros.exists():

            return Response({'message':'Nenhum registro encontrado'},status=status.HTTP_400_BAD_REQUEST)
        

        serializer = self.get_serializer(registros, many = True)

        return Response(serializer.data)


    @action(detail=False, methods=['GET'])

    def search_by_date(self, request):

        data_str = request.query_params.get('data', None)

        if not data_str:

            return Response(status=status.HTTP_400_BAD_REQUEST)

        
        try:

            data = datetime.strptime(data_str, '%d-%m-%Y').date()

        except ValueError:

            return Response(status=status.HTTP_400_BAD_REQUEST)

        
        registros = RegEmpre.objects.filter(data = data)

        if not registros.exists():

            return Response(status=status.HTTP_400_BAD_REQUEST)

        
        serializer = self.get_serializer(registros, many = True)

        return Response(serializer.data)


class RegFuncViewSet(viewsets.ModelViewSet):

    queryset  = RegFunc.objects.all()

    serializer_class = RegFuncSerializer


    @action(detail=False, methods=['GET'])


    def search(self, request):

        nome_func = request.query_params.get('nome_func', None)

        if not nome_func:

            return Response(status = status.HTTP_400_BAD_REQUEST)
        
    
        try:

            nome_func = str(nome_func)

        except ValueError:

            return Response(status=status.HTTP_400_BAD_REQUEST)
        

        registros = RegFunc.objects.filter(nome_func = nome_func)

        if not registros.exists():

            return Response(status = status.HTTP_400_BAD_REQUEST)
        

        serializer = self.get_serializer(registros, many = True)

        return Response(serializer.data)
    


    @action(detail=False, methods=['GET'])


    def search_by_date(self, request):


        data_str = request.query_params.get('data', None)

        if not data_str:

            return Response(status=status.HTTP_400_BAD_REQUEST)
        

        try:

            data = datetime.strptime(data_str, '%d-%m-%Y').date()

        except ValueError:

            return Response(status=status.HTTP_400_BAD_REQUEST)
        

        registros = RegFunc.objects.filter(data=data)

        if not registros.exists():

            return Response(status = status.HTTP_400_BAD_REQUEST)


        serializer = self.get_serializer(registros, many = True)


        return Response(serializer.data)
    
    
class GeempreViewSet(viewsets.ModelViewSet):

    queryset = Geempre.objects.all()

    serializer_class = GeempreSerializer

    @action(detail=False, methods=['GET'])
    def search(self, request):

        cod_empresa = request.query_params.get('cod_empresa', None)

        if not cod_empresa:

            return Response(status=status.HTTP_400_BAD_REQUEST)
        

        try:

            int(cod_empresa)

        except ValueError:

            return Response(status=status.HTTP_400_BAD_REQUEST)


        registros = Geempre.objects.filter(cod_empresa = cod_empresa)

        if not registros.exists():

            return Response(status=status.HTTP_400_BAD_REQUEST)
        
    
        serializer = self.get_serializer(registros, many = True)


        return Response((serializer.data[0])['nome'])

class AnaliseViewSet(viewsets.ViewSet):


    @action(detail=False, methods=['GET'])

    def search_all(self, request):

        registros_empresa = RegEmpre.objects.all()

        serializer_empresa = RegEmpreSerializer(registros_empresa, many = True)
        

        registros_funcionario = RegFunc.objects.all()
        


        serializer_func = RegFuncSerializer(registros_funcionario, many = True)

        dataframe_func = pd.DataFrame(serializer_func.data)

        dataframe_func['data'] = pd.to_datetime(dataframe_func['data'])

        dataframe_func['ano_mes'] = dataframe_func['data'].dt.to_period('M').astype(str)

        grupo_func = dataframe_func.groupby('ano_mes')


        dataframe_empresa = pd.DataFrame(serializer_empresa.data)


        dataframe_empresa['data'] = pd.to_datetime(dataframe_empresa['data'])


        dataframe_empresa['ano_mes'] = dataframe_empresa['data'].dt.to_period('M').astype(str)


        
        grupo = dataframe_empresa.groupby('ano_mes')
        

        resultado = []


        for (periodo, dataframe_empresa_relatorio), (periodo, dataframe_func) in zip(grupo, grupo_func):

            #calculo valores de funcionario e tempo

            departamentos_avaliados = ['CONTABIL','PESSOAL','FISCAL']

            dataframe_func_filtrado = dataframe_func[(dataframe_func['departamento'].isin(departamentos_avaliados))]

            total_hora = 220

            total_hora_real = 200

            soma_total_hora = dataframe_func_filtrado['total_hora'].sum()

            soma_tempo_ativ = dataframe_func_filtrado['tempo_ativ'].sum()

            custo_folha = 220*(soma_total_hora)



            media_tempo = (soma_tempo_ativ)/dataframe_func_filtrado.shape[0]

            relacao_tempo_total = media_tempo/200

            #calculo valores de empresa 

            faturamento_total_mes = dataframe_empresa_relatorio['faturamento'].sum()

            custo_dp_total = dataframe_empresa_relatorio['custo_dp'].sum()

            custo_fiscal_total = dataframe_empresa_relatorio['custo_fiscal'].sum()

            custo_contabil_total = dataframe_empresa_relatorio['custo_contabil'].sum()

            custo_fixo_total = round(dataframe_empresa_relatorio['custo_fixo_total'].sum())

            custo_operacional_total = custo_dp_total+custo_contabil_total+custo_fiscal_total

            # Identificando e retirando valores outliers

            Q1 = dataframe_empresa_relatorio['rentabilidade'].quantile(0.25)

            Q3 = dataframe_empresa_relatorio['rentabilidade'].quantile(0.75)

            IQR = Q3-Q1

            lower_limit = Q1 -1.5*IQR

            upper_limit = Q3 + 1.5*IQR

            valores_rentabilidade_sem_outlier = dataframe_empresa_relatorio['rentabilidade'][(dataframe_empresa_relatorio['rentabilidade']>=lower_limit)&(dataframe_empresa_relatorio['rentabilidade']<=upper_limit)]
            
            media_rentabilidade = valores_rentabilidade_sem_outlier.mean()

            desvio_padrão_rentabilidade = valores_rentabilidade_sem_outlier.std()

            #função de probabilidade distribuição normal

            '''
            #sf(x) = 1/(sqr(2*pi*(std^2))* e^(-((x-u)^2)/2(std^2)
            '''

            qtd_empresa = dataframe_empresa_relatorio.shape[0]

            qtd_r_abaixo_de_0 = (dataframe_empresa_relatorio['rentabilidade']<1).sum()

            qtd_r_abaixo_media = (dataframe_empresa_relatorio['rentabilidade']<media_rentabilidade).sum()
            
            #Gerando relatorio planilhado

            dataframe_relatorio_mes = pd.DataFrame()

            dataframe_relatorio_mes['faturamento_total'] = pd.Series(faturamento_total_mes)

            dataframe_relatorio_mes['custo_folha'] = pd.Series(custo_folha)
            
            dataframe_relatorio_mes['media_tempo'] = pd.Series(media_tempo)

            dataframe_relatorio_mes['rel_tempo_total'] = pd.Series(relacao_tempo_total)

            dataframe_relatorio_mes['custo_fixo_total'] = pd.Series(custo_fixo_total)

            dataframe_relatorio_mes['custo_operacional_total'] = pd.Series(custo_operacional_total)

            dataframe_relatorio_mes['custo_total'] = pd.Series((custo_fixo_total+custo_operacional_total))

            dataframe_relatorio_mes['custo_dp_total'] = pd.Series(custo_dp_total)

            dataframe_relatorio_mes['custo_fiscal_total'] = pd.Series(custo_fiscal_total)
            
            dataframe_relatorio_mes['custo_contabil_total'] = pd.Series(custo_contabil_total)

            dataframe_relatorio_mes['media_rentabilidade'] = pd.Series(media_rentabilidade)

            dataframe_relatorio_mes['desvio_padrao'] = pd.Series(desvio_padrão_rentabilidade)

            dataframe_relatorio_mes['qtd_empresas'] = pd.Series(qtd_empresa)

            dataframe_relatorio_mes['qtd_m_1'] = pd.Series(qtd_r_abaixo_de_0)

            dataframe_relatorio_mes['qtd_m_media'] = pd.Series(qtd_r_abaixo_media)

            dataframe_relatorio_mes['data'] = pd.Series((periodo+'-1'))

            resultado.append((dataframe_relatorio_mes.iloc[0]).to_dict())

        return Response(resultado) 



    @action(detail=False, methods=['GET'])

    def search_date(self, request):


        data_str = request.query_params.get('data', None)

        if not data_str:

            return Response(status=status.HTTP_400_BAD_REQUEST)

        
        try:

            data = datetime.strptime(data_str, '%d-%m-%Y').date()

        except ValueError:

            return Response(status=status.HTTP_400_BAD_REQUEST)
        

        
        registros_empresa = RegEmpre.objects.filter(data = data)


        serializer_empresa = RegEmpreSerializer(registros_empresa, many=True)



        registros_funcionarios = RegFunc.objects.filter(data=data)


        serializer_funcionario = RegFuncSerializer(registros_funcionarios, many = True)

        
        dataframe_empresa_relatorio = pd.DataFrame(serializer_empresa.data)



        registros_funcionario = RegFunc.objects.filter(data=data)
        


        serializer_func = RegFuncSerializer(registros_funcionario, many = True)



        dataframe_func = pd.DataFrame(serializer_func.data)




        ############ Analise Estatistica ########################

         #calculo valores de funcionario e tempo

        departamentos_avaliados = ['CONTABIL','PESSOAL','FISCAL']

        dataframe_func_filtrado = dataframe_func[(dataframe_func['departamento'].isin(departamentos_avaliados))]

        total_hora = 220

        total_hora_real = 200

        soma_total_hora = dataframe_func_filtrado['total_hora'].sum()

        soma_tempo_ativ = dataframe_func_filtrado['tempo_ativ'].sum()

        custo_folha = 220*(soma_total_hora)



        media_tempo = (soma_tempo_ativ)/dataframe_func_filtrado.shape[0]

        relacao_tempo_total = media_tempo/200


        #calculo de valores empresa

        faturamento_total_mes = dataframe_empresa_relatorio['faturamento'].sum()

        custo_dp_total = dataframe_empresa_relatorio['custo_dp'].sum()

        custo_fiscal_total = dataframe_empresa_relatorio['custo_fiscal'].sum()

        custo_contabil_total = dataframe_empresa_relatorio['custo_contabil'].sum()

        custo_fixo_total = round(dataframe_empresa_relatorio['custo_fixo_total'].sum())

        custo_operacional_total = custo_dp_total+custo_contabil_total+custo_fiscal_total



        # Identificando e retirando valores outliers

        Q1 = dataframe_empresa_relatorio['rentabilidade'].quantile(0.25)

        Q3 = dataframe_empresa_relatorio['rentabilidade'].quantile(0.75)

        IQR = Q3-Q1

        lower_limit = Q1 -1.5*IQR
        upper_limit = Q3 + 1.5*IQR

        valores_rentabilidade_sem_outlier = dataframe_empresa_relatorio['rentabilidade'][(dataframe_empresa_relatorio['rentabilidade']>=lower_limit)&(dataframe_empresa_relatorio['rentabilidade']<=upper_limit)]
        


        media_rentabilidade = valores_rentabilidade_sem_outlier.mean()

        desvio_padrão_rentabilidade = valores_rentabilidade_sem_outlier.std()


        #função de probabilidade distribuição normal


        '''
        #sf(x) = 1/(sqr(2*pi*(std^2))* e^(-((x-u)^2)/2(std^2)
        '''

        qtd_r_abaixo_de_0 = (dataframe_empresa_relatorio['rentabilidade']<1).sum()

        qtd_r_abaixo_media = (dataframe_empresa_relatorio['rentabilidade']<media_rentabilidade).sum()
        

        #Gerando relatorio planilhado

        dataframe_relatorio_mes = pd.DataFrame()


        dataframe_relatorio_mes['faturamento_total'] = pd.Series(faturamento_total_mes)

        dataframe_relatorio_mes['custo_folha'] = pd.Series(custo_folha)
            
        dataframe_relatorio_mes['media_tempo'] = pd.Series(media_tempo)

        dataframe_relatorio_mes['rel_tempo_total'] = pd.Series(relacao_tempo_total)

        dataframe_relatorio_mes['custo_fixo_total'] = pd.Series(custo_fixo_total)

        dataframe_relatorio_mes['custo_operacional_total'] = pd.Series(custo_operacional_total)

        dataframe_relatorio_mes['custo_dp_total'] = pd.Series(custo_dp_total)

        dataframe_relatorio_mes['custo_fiscal_total'] = pd.Series(custo_fiscal_total)
        
        dataframe_relatorio_mes['custo_contabil_total'] = pd.Series(custo_contabil_total)

        dataframe_relatorio_mes['media_rentabilidade'] = pd.Series(media_rentabilidade)

        dataframe_relatorio_mes['desvio_padrao'] = pd.Series(desvio_padrão_rentabilidade)

        dataframe_relatorio_mes['qtd_m_1'] = pd.Series(qtd_r_abaixo_de_0)

        dataframe_relatorio_mes['qtd_m_media'] = pd.Series(qtd_r_abaixo_media)


       
        response_dict = dataframe_relatorio_mes.to_dict(orient='records')

        
        return Response(response_dict)











