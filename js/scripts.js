window.addEventListener('DOMContentLoaded', async (event)=>{
    async function leerexcel(nombre){
        const response = await fetch(nombre);
        const blob= await response.blob();
        const arrayBuffer = await blob.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });        
        const carreras= XLSX.utils.sheet_to_json(workbook.Sheets['Carreras']);
        const universidades=XLSX.utils.sheet_to_json(workbook.Sheets['Universidades']);
        const datos=XLSX.utils.sheet_to_json(workbook.Sheets['Sheet2']);
        return{
            carreras: carreras,
            universidades: universidades,
            datos: datos
        };
    }

    const data= await leerexcel('../excel/Hoja de datos.xlsx');
    const divcarga= document.getElementById("carga");
    divcarga.style.display= "none";
    const desplegable1= document.getElementById("carrera");
    data.carreras.forEach(function(opcion){
        const elementonuevo= document.createElement("option");
        elementonuevo.value= opcion.Carrera.trim();
        elementonuevo.textContent= opcion.Carrera.trim();
        desplegable1.appendChild(elementonuevo);
    })
    const desplegable2= document.getElementById("universidad");
    data.universidades.forEach(opcion =>{
        let elementonuevo= document.createElement("option");
        elementonuevo.value= opcion.Universidad.trim();
        elementonuevo.textContent=opcion.Universidad.trim();
        desplegable2.appendChild(elementonuevo);
    });    
    const botonconfirmar= document.getElementById("confirmar")
    botonconfirmar.addEventListener("click",()=>{
        const Carreraseleccionada= desplegable1.value.trim();
        const Universidadseleccionada= desplegable2.value.trim();
        if (!Carreraseleccionada||!Universidadseleccionada) {
            alert("Por favor, seleccione los dos datos antes de confirmar");
            return;
        }
        const elementobuscado= data.datos.find(elemento =>
            elemento.Carrera.trim() == Carreraseleccionada && elemento.Universidad.trim() == Universidadseleccionada
        );
        const divelementobuscado=document.getElementById("obtenido");
        if (elementobuscado){
            divelementobuscado.style.display= "block";
            divelementobuscado.innerHTML= `Carrera: ${elementobuscado.Carrera} <br>Universidad: ${elementobuscado.Universidad} <br> Rendimiento (porcentaje de créditos aprobados respecto a los matriculados): ${elementobuscado.rend} <br> Éxito (porcentaje de afiliados a la S.S. 4 años después de graduarse) ${elementobuscado.exit} <br> Nota media de los graduados: ${elementobuscado.nota} <br> si alguno de estos datos es 0, significa que no tenemos esa información`;
        }else{
            alert("No existe esa carrera en esa universidad");
        }

    });
});