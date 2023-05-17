from django.http import HttpResponse
from django.shortcuts import render
from django.core.files.storage import FileSystemStorage
from webIA.views.views import logoutApp
from django.conf import settings
import requests
import json
import os

def get_products(request):
    if("jwt-key" not in request.session):
        return HttpResponse("Unauthorized Access")
    else:
        req_headers = {'Authorization' : 'Bearer {}'.format(request.session['jwt-key']['token'])}
        response = requests.get("http://localhost:3000/api/v1/products",headers=req_headers)
        resCategory = requests.get("http://localhost:3000/api/v1/categories",headers=req_headers)
        if resCategory.status_code == 200:
            productsText = response.text.replace("_id","atrId")
            products_json = json.loads(productsText)
            categoryText = resCategory.text.replace("_id","atrId")
            category_json = json.loads(categoryText)
            return render(request,'productsAdmin.html',{"products":products_json,"categories":category_json,"user":request.session['jwt-key']['user']})
        else:
            message = ""
            if "jwt expired" in resCategory.text:
                message = "Your session has been expired!"
                return logoutApp(request)
            elif "invalid token" in resCategory.text:
                message = "Unauthorized Access: Your token is invalid!"
                return HttpResponse(message)
            elif "The token has been revoked" in resCategory.text:
                message = "Unauthorized Access: Your token is invalid!"
                return HttpResponse(message)
            
def get_product(request,id):
    template = "base.html"
    response = requests.get("http://localhost:3000/api/v1/products/product/{}".format(id))
    if response.status_code == 200:
        product = response.text.replace("_id","atrId")
        product_json = json.loads(product)
        if 'jwt-key' in request.session:
            template = "baseCustomer.html"
            return render(request,'detail-product.html',{"product":product_json,"template":template,"user":request.session['jwt-key']['user']})
        else:
            return render(request,'detail-product.html',{"product":product_json,"template":template})
    
def post_product(request):
    if("jwt-key" not in request.session):
        return HttpResponse("Unauthorized Access")
    else:
        req_headers = {'Authorization' : 'Bearer {}'.format(request.session['jwt-key']['token'])}
        payload = {"name":request.POST["name"],
                "brand":request.POST["brand"],
                "price":request.POST["price"],
                "color":request.POST["color"],
                "size":request.POST["size"],
                "inStock":request.POST["inStock"],
                "category":request.POST["category"]
        }
        if("image" in request.FILES):
            file = request.FILES["image"]
            payload["image"] = file.name

        response = requests.post("http://localhost:3000/api/v1/products/register",json=payload,headers=req_headers)
        if response.status_code == 200:
            if("image" in request.FILES):
                fss = FileSystemStorage()
                fss.save(file.name,file)
            return HttpResponse(response)
        else:
            return HttpResponse(response.status_code)

def post_product_category(request):
    if("jwt-key" not in request.session):
        return HttpResponse("Unauthorized Access")
    else:
        product = request.POST["product"]
        category = request.POST["category"]
        req_headers = {'Authorization' : 'Bearer {}'.format(request.session['jwt-key']['token'])}
        resCategory = requests.put("http://localhost:3000/api/v1/categories/addProduct/{}/{}".format(category,product),headers=req_headers)
        if resCategory.status_code == 200:
            return HttpResponse(resCategory)
        else:
            return HttpResponse(resCategory.status_code)
    
def delete_product(request):
    if("jwt-key" not in request.session):
        return HttpResponse("Unauthorized Access")
    else:
        product = request.POST["product"]
        image = request.POST["image"]
        req_headers = {'Authorization' : 'Bearer {}'.format(request.session['jwt-key']['token'])}
        response = requests.delete("http://localhost:3000/api/v1/products/{}".format(product),headers=req_headers)
        if response.status_code == 200:
            if(request.POST["image"] != ""):
                try:
                    os.remove(os.path.join(settings.MEDIA_ROOT+"/"+image))
                except:
                    pass
            return HttpResponse(response)
        else:
            return HttpResponse(response.status_code)

def delete_product_category(request):
    if("jwt-key" not in request.session):
        return HttpResponse("Unauthorized Access")
    else:
        product = request.POST["product"]
        category = request.POST["category"]
        req_headers = {'Authorization' : 'Bearer {}'.format(request.session['jwt-key']['token'])}
        resCategory = requests.put("http://localhost:3000/api/v1/categories/removeProduct/{}/{}".format(category,product),headers=req_headers)
        if resCategory.status_code == 200:
            return HttpResponse(resCategory)
        else:
            return HttpResponse(resCategory.status_code)

def update_product(request):
    if("jwt-key" not in request.session):
        return HttpResponse("Unauthorized Access")
    else:
        id=request.POST["id"]
        oldImage = request.POST["oldImage"]
        payload = {"name":request.POST["name"],
                "brand":request.POST["brand"],
                "price":request.POST["price"],
                "color":request.POST["color"],
                "size":request.POST["size"],
                "inStock":request.POST["inStock"],
                "category":request.POST["category"]
        }
        if("image" in request.FILES):
            file = request.FILES["image"]
            payload["image"] = file.name
        
        req_headers = {'Authorization' : 'Bearer {}'.format(request.session['jwt-key']['token'])}
        response = requests.put("http://localhost:3000/api/v1/products/{}".format(id),json=payload,headers=req_headers)
        if response.status_code == 200:
            if("image" in request.FILES):
                try:
                    os.remove(os.path.join(settings.MEDIA_ROOT+"/"+oldImage))
                except:
                    pass
                fss = FileSystemStorage()
                fss.save(file.name,file)
            return HttpResponse(response)
        else:
            return HttpResponse(response.status_code)
        