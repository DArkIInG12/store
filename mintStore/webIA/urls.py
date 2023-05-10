from django.contrib import admin
from django.urls import path
from webIA.views.views import index,register,login,indexAdmin,dashboardAdmin,indexCustomer,loginApp,logoutApp
from webIA.views.productViews import get_products,post_product,post_product_category,delete_product,delete_product_category,update_product
from webIA.views.userViews import get_users,post_user,delete_user,update_user
from webIA.views.categoryViews import get_categories,post_category,delete_category,update_category
from webIA.views.supplierViews import get_suppliers,post_supplier,delete_supplier,update_supplier
from webIA.views.couponViews import get_coupons,post_coupon,delete_coupon,update_coupon
from webIA.views.paymentViews import get_payments,post_payment,delete_payment,update_payment
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('home/',index,name='index'),
    path('register/',register,name='register'),
    path('admon/users/',get_users,name='users'),
    path('registerUser/',post_user,name='registerUser'),
    path('deleteUser/',delete_user,name='deleteUser'),
    path('updateUser/',update_user,name="updateUser"),
    path('login/',login,name='login'),
    path('loginUser/',loginApp,name='logUser'),
    path('logout/',logoutApp,name='logout'),
    path('customer/index/',indexCustomer,name='indexCustomer'),
    path('admon/index/',indexAdmin,name='indexAdmin'),
    path('admon/products/',get_products,name='products'),
    path('registerProduct/',post_product,name='registerProduct'),
    path('registerProductCategory/',post_product_category,name="registerProductCategory"),
    path('updateProduct/',update_product,name='updateProduct'),
    path('deleteProduct/',delete_product,name='deleteProduct'),
    path('deleteProductCategory/',delete_product_category,name="deleteProductCategory"),
    path('admon/categories/',get_categories,name="categories"),
    path('registerCategory/',post_category,name="registerCategory"),
    path('updateCategory/',update_category,name="updateCategory"),
    path('deleteCategory/',delete_category,name="deleteCategory"),
    path('admon/suppliers/',get_suppliers,name="suppliers"),
    path('registerSupplier/',post_supplier,name="registerSupplier"),
    path('updateSupplier/',update_supplier,name="updateSupplier"),
    path('deleteSupplier/',delete_supplier,name="deleteSupplier"),
    path('admon/coupons/',get_coupons,name="coupons"),
    path('registerCoupon/',post_coupon,name="registerCoupon"),
    path('updateCoupon/',update_coupon,name="updateCoupon"),
    path('deleteCoupon/',delete_coupon,name="deleteCoupon"),
    path('admon/payments/',get_payments,name="payments"),
    path('registerPayment/',post_payment,name="registerPayment"),
    path('updatePayment/',update_payment,name="updatePayment"),
    path('deletePayment/',delete_payment,name="deletePayment"),
    path('admon/dashboard/',dashboardAdmin,name='dashboard'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)