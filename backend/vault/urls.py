from django.urls import path
from .views import AddVaultItemView, GetVaultItemsView, DeleteVaultItemView, UpdateVaultItemView

urlpatterns = [
    path('add/', AddVaultItemView.as_view()),
    path('list/', GetVaultItemsView.as_view()),
    path('delete/<int:pk>/', DeleteVaultItemView.as_view()),
    path('update/<int:pk>/', UpdateVaultItemView.as_view()),

]