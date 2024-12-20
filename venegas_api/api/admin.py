from django.contrib import admin

from .models import RegEmpre, RegFunc, Geempre



@admin.register(RegEmpre)

class RegEmpreAdmin(admin.ModelAdmin):pass



@admin.register(RegFunc)

class RegFuncAdmin(admin.ModelAdmin):pass


@admin.register(Geempre)

class GeempreAdmin(admin.ModelAdmin):pass