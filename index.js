window.onload = function() {
    const limpiar = document.getElementById('limpiar');    
    const cartel=document.getElementById("cartel-nocss")
    const form=document.getElementById("formulario") 
    const textarea=document.getElementById("css-entrada")
    const p=document.getElementById("css-salida")

    const eliminarEspacios=function(cadena){
        while(cadena.charAt(0)=="\n" || cadena.charAt(0)==" "){
            cadena=cadena.slice(1)
        }
        while(cadena.charAt(cadena.length-1)=="\n" || cadena.charAt(cadena.length-1)==" "){
            cadena=cadena.slice(0,cadena.length-1)
        }
        return cadena
    }

    const buscarEtiqueta=function(txt){
        var objRetorno={
        }
        var indiceCorchete1=txt.indexOf("{")
        var indiceCorchete2=txt.indexOf("}")  


        var nombre=txt.slice(0,indiceCorchete1)
        var propiedades=txt.slice(indiceCorchete1+1,indiceCorchete2)
        var etiqueta=nombre+propiedades
        var txt = txt.slice(indiceCorchete2+1)
    

        //etiqueta
        objRetorno.nombreEtiqueta=eliminarEspacios(nombre)

        //propiedades de la etiqueta
        objRetorno.propiedadesEtiqueta=eliminarEspacios(propiedades)

        //texto restante
        objRetorno.txtRestante=eliminarEspacios(txt)

        if(objRetorno.txtRestante.indexOf("{")==-1){
            objRetorno.fin=true;
        }else{
            objRetorno.fin=false;
        }

        //devuelve el etiqueta, propiedades, y las etiquetas que restan
        return objRetorno
    }

    const clasificarEtiquetas=function(txt){
        var obj={}
        var cssOrganizado={}
        var tags=[]
        var ids=[]
        var clases=[]
        var fin
        
        do{
            obj=buscarEtiqueta(txt)
            
            if(obj.nombreEtiqueta.charAt(0)=="."){
                clases.push(obj)
            }else if(obj.nombreEtiqueta.charAt(0)=="#"){
                ids.push(obj)
            }else{
                tags.push(obj)
            }
            fin=obj.fin
            txt=obj.txtRestante
        }while(!fin)

        cssOrganizado.tags=tags
        cssOrganizado.ids=ids
        cssOrganizado.clases=clases

        return cssOrganizado
    }
    

    const ordenarEtiquetas=function(array){
        var puntero1
        var puntero2
        var aux
        var largo=array.length
        var lista=array

        while(largo>=2){
            puntero1=0
            puntero2=1
            while(puntero2<largo){
                if(lista[puntero1].nombreEtiqueta.localeCompare(lista[puntero2].nombreEtiqueta)==1){
                    aux=lista[puntero2]
                    lista[puntero2]=lista[puntero1]
                    lista[puntero1]=aux
                }
                puntero1=puntero1+1
                puntero2=puntero2+1
            }
            largo=largo-1
        }
        return lista
    }
        

    const buscarPropiedad=function(txt){
        var indicePuntoYComa=txt.indexOf(";")  
        var retorno={}
        var propiedad=txt.slice(0,indicePuntoYComa+1)
        propiedad=eliminarEspacios(propiedad)
        
        retorno.txtRestante=txt.slice(indicePuntoYComa+1,txt.length)
        if(retorno.txtRestante.indexOf(";")==-1){
            retorno.fin=true
        }else{
            retorno.fin=false            
        }
        retorno.propiedad=propiedad
        return retorno
    }

    const listarPropiedades=function(txt){
        var lista=[]
        var indice=0
        var fin=false
        do{
            obj=buscarPropiedad(txt)
            lista[indice]=obj.propiedad
            indice=indice+1
            txt=obj.txtRestante
            fin=obj.fin
        }while(!fin)
        return lista
    }

    const ordenarPropiedades=function(array){
        var puntero1
        var puntero2
        var aux
        var largo=array.length
        var lista=array

        while(largo>=2){
            puntero1=0
            puntero2=1
            while(puntero2<largo){
                if(lista[puntero1].localeCompare(lista[puntero2])==1){
                    aux=lista[puntero2]
                    lista[puntero2]=lista[puntero1]
                    lista[puntero1]=aux
                }
                puntero1=puntero1+1
                puntero2=puntero2+1
            }
            largo=largo-1
        }
        return lista
    }
    
    const organizarCSS=function(txt){

        var ids=ordenarEtiquetas(clasificarEtiquetas(txt).ids)
        var clases=ordenarEtiquetas(clasificarEtiquetas(txt).clases)
        var tags=ordenarEtiquetas(clasificarEtiquetas(txt).tags)
        var cssOrganizado=""
        var listadoPropiedades

        ids.forEach(function(id) {
            cssOrganizado=cssOrganizado+id.nombreEtiqueta+"{ \n"
            listadoPropiedades=ordenarPropiedades(listarPropiedades(id.propiedadesEtiqueta))
            listadoPropiedades.forEach(function (prop) {
                cssOrganizado=cssOrganizado+prop+"\n"
            })
            cssOrganizado=cssOrganizado+"} \n"
        }, this);

        clases.forEach(function(clas) {
            cssOrganizado=cssOrganizado+clas.nombreEtiqueta+"{ \n"
            listadoPropiedades=ordenarPropiedades(listarPropiedades(clas.propiedadesEtiqueta))
            listadoPropiedades.forEach(function (prop) {
                cssOrganizado=cssOrganizado+prop+"\n"
            })
            cssOrganizado=cssOrganizado+"} \n"
        }, this);

        tags.forEach(function(tag) {
            cssOrganizado=cssOrganizado+tag.nombreEtiqueta+"{ \n"
            listadoPropiedades=ordenarPropiedades(listarPropiedades(tag.propiedadesEtiqueta))
            listadoPropiedades.forEach(function (prop) {
                cssOrganizado=cssOrganizado+prop+"\n"
            })
            cssOrganizado=cssOrganizado+"} \n"
        }, this);
        return cssOrganizado
    }
    
    limpiar.onclick = function() {
        p.innerText=""
        textarea.value=""
    }

   form.onsubmit=function(evento){ 
        evento.preventDefault()  
     

        if(textarea.value.indexOf("{")!=-1 && textarea.value.indexOf("}")!=-1 ){
            cartel.style.display="none"
            var ids=ordenarEtiquetas(clasificarEtiquetas(textarea.value).ids)
            var cssSalida=organizarCSS(textarea.value)
            p.innerText=cssSalida
        }else{
            cartel.innerText="Ingresar CSS \n -Ingresar al menos una etiqueta valida css \n" 
            cartel.style.display="block"
        }
    }
}