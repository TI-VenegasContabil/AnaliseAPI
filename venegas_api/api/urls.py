from django.urls import path, include
from .views import RegEmpreViewSet, RegFuncViewSet, GeempreViewSet, AnaliseViewSet
from rest_framework.routers import SimpleRouter

router = SimpleRouter()


router.register('reg_empre', RegEmpreViewSet)
router.register('reg_func', RegFuncViewSet)
router.register('geempre',GeempreViewSet )
router.register('analise', AnaliseViewSet, basename='analise')



urpatterns = [
]