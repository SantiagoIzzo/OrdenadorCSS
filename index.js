
window.onload = function() {
    const limpiar = document.getElementById('limpiar');    
    const primero = document.getElementById('primera');
    const segundo = document.getElementById('segunda');        
    const tercero = document.getElementById('tercera');            
    const cartel=document.getElementById("cartel-nocss")
    const aceptar=document.getElementById("aceptar")
    const textarea=document.getElementById("css-entrada")
    const p=document.getElementById("css-salida")
    const orden=["","#Ids",".Classes","Tags"]
    var indicePrimero=0;
    var indiceSegundo=0;
    var indiceTercero=0;

    //cambiar orden 
    primero.onclick=function(){
        indicePrimero=indicePrimero+1
        if(indicePrimero>orden.length-1){
            indicePrimero=0;
        }
        while(indicePrimero!=0 && (indicePrimero==indiceSegundo || indicePrimero==indiceTercero)){
            indicePrimero=indicePrimero+1
            if(indicePrimero>orden.length-1){
                indicePrimero=0;
            }
            console.log("1")
        }
        if(indicePrimero>orden.length-1){
            indicePrimero=0;
        }
        primero.innerText=orden[indicePrimero]
    }

    segundo.onclick=function(){
        indiceSegundo=indiceSegundo+1
        if(indiceSegundo>orden.length-1){
            indiceSegundo=0;
        }
        while(indiceSegundo!=0 && (indiceSegundo==indicePrimero || indiceSegundo==indiceTercero)){
            indiceSegundo=indiceSegundo+1
            if(indiceSegundo>orden.length-1){
                indiceSegundo=0;
            }
            console.log("2")
        }
        if(indiceSegundo>orden.length-1){
            indiceSegundo=0;
        }
        segundo.innerText=orden[indiceSegundo]
    }

    tercero.onclick=function(){
        indiceTercero=indiceTercero+1
        while(indiceTercero!=0 && (indiceTercero==indicePrimero || indiceTercero==indiceSegundo)){
            indiceTercero=indiceTercero+1
            if(indiceTercero>orden.length-1){
                indiceTercero=0;
            }
            console.log(3)
        }
        if(indiceTercero>orden.length-1){
            indiceTercero=0;
        }
        tercero.innerText=orden[indiceTercero]
    }

    //elimina los espacios y retornos de carro
    const eliminarEspacios=function(cadena){
        while(cadena.charAt(0)=="\n" || cadena.charAt(0)==" "){
            cadena=cadena.slice(1)
        }
        while(cadena.charAt(cadena.length-1)=="\n" || cadena.charAt(cadena.length-1)==" "){
            cadena=cadena.slice(0,cadena.length-1)
        }
        return cadena
    }

    //busca en el texto una etiqueta, la recorta del txt, por un lado la etiqueta y por otro las propiedades las guarda en variables junto, con
    //el resto del texto y lo devuelve todo en un objeto
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

        //devuelve la etiqueta, propiedades, y el texto que resta para organizar
        return objRetorno
    }


    //recorre el texto buscando etiquetas y las va organizando en tres arrays ids, tags y clases y lo retorna en un obj
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
    
    //resive un array con etiquetas y lo ordena y retorna el array ordenado
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
        
    //recorre un texto que contiene todas las propiedades de una etiqueta, recorta la primera que encuentra y la guarda en un objeto junto con el resto 
    // texto
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

    // genera array con propiedades de una etiqueta 
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

    //ordena el array de propiedades alfabeticamente y lo retorna
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
    
    //funcion principal que llama a todas las anteriores y organiza el css
    const organizarCSS=function(txt){

        var ids=ordenarEtiquetas(clasificarEtiquetas(txt).ids)
        var clases=ordenarEtiquetas(clasificarEtiquetas(txt).clases)
        var tags=ordenarEtiquetas(clasificarEtiquetas(txt).tags)
        var cssOrganizado=""
        var listadoPropiedades
        var indiceOrden=0
        var ordenEtiquetas=[]
        ordenEtiquetas[0]=document.getElementById("primera").innerText
        ordenEtiquetas[1]=document.getElementById("segunda").innerText
        ordenEtiquetas[2]=document.getElementById("tercera").innerText
        console.log()
        while(indiceOrden<3){
            if(ordenEtiquetas[indiceOrden]=="#Ids"){
                ids.forEach(function(id) {
                    cssOrganizado=cssOrganizado+id.nombreEtiqueta+"{ \n"
                    listadoPropiedades=ordenarPropiedades(listarPropiedades(id.propiedadesEtiqueta))
                    listadoPropiedades.forEach(function (prop) {
                        cssOrganizado=cssOrganizado+prop+"\n"
                    })
                    cssOrganizado=cssOrganizado+"} \n"
                }, this);
            }

            if(ordenEtiquetas[indiceOrden]==".Classes"){
                clases.forEach(function(clas) {
                    cssOrganizado=cssOrganizado+clas.nombreEtiqueta+"{ \n"
                    listadoPropiedades=ordenarPropiedades(listarPropiedades(clas.propiedadesEtiqueta))
                    listadoPropiedades.forEach(function (prop) {
                        cssOrganizado=cssOrganizado+prop+"\n"
                    })
                    cssOrganizado=cssOrganizado+"} \n"
                }, this);
            }
            
            if(ordenEtiquetas[indiceOrden]=="Tags"){
                tags.forEach(function(tag) {
                    cssOrganizado=cssOrganizado+tag.nombreEtiqueta+"{ \n"
                    listadoPropiedades=ordenarPropiedades(listarPropiedades(tag.propiedadesEtiqueta))
                    listadoPropiedades.forEach(function (prop) {
                        cssOrganizado=cssOrganizado+prop+"\n"
                    })
                    cssOrganizado=cssOrganizado+"} \n"
                }, this);
            }
            indiceOrden=indiceOrden+1
        }

        return cssOrganizado
    }
    
    limpiar.onclick = function() {
        p.innerText=""
        textarea.value=""
    }

    aceptar.onclick=function(){ 
        var faltaSeleccionarOrden=false
        var inputsOrden=[]
        inputsOrden[0]=document.getElementById("primera")
        inputsOrden[1]=document.getElementById("segunda")
        inputsOrden[2]=document.getElementById("tercera")
        inputsOrden.forEach(function(input){
            if(input.innerText==""){
                faltaSeleccionarOrden=true
            }
        })

        if(textarea.value.indexOf("{")!=-1 && textarea.value.indexOf("}")!=-1 && !faltaSeleccionarOrden){
            cartel.style.display="none"
            var ids=ordenarEtiquetas(clasificarEtiquetas(textarea.value).ids)
            var cssSalida=organizarCSS(textarea.value)
            p.innerText=cssSalida
        }else{
            cartel.innerText="-Ingrese al menos una etiqueta CSS. \n\n -Establesca el orden segun tipo de etiquetas." 
            cartel.style.display="block"
        }
        
    }
}
