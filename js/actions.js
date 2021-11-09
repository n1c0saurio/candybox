/*
 * Métodos para mostrar y ocultar el menú responsivo
 */

$("#btn-main-menu-open").click(function () {
  $("#main-menu-list").addClass("show");
});

$("#btn-main-menu-close").click(function () {
  $("#main-menu-list").removeClass("show");
});

// Cierra el menú cuando se cliquea el enlace que dirige al pie de página
$("#main-menu-item-contact").click(function () {
  $("#main-menu-list").removeClass("show");
});

/*
 * Añade un efecto de scroll suave a los enlaces dentro de la misma página
 * fuente: https://github.com/bendc/anchor-scroll/
 */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const root = (() => {
    if ("scrollingElement" in document) return document.scrollingElement;
    const html = document.documentElement;
    const start = html.scrollTop;
    html.scrollTop = start + 1;
    const end = html.scrollTop;
    html.scrollTop = start;
    return end > start ? html : document.body;
  })();

  const ease = (duration, elapsed, start, end) =>
    Math.round(end * (-Math.pow(2, (-10 * elapsed) / duration) + 1) + start);

  const getCoordinates = (hash) => {
    const start = root.scrollTop;
    const delta = (() => {
      if (hash.length < 2) return -start;
      const target = document.querySelector(hash);
      if (!target) return;
      const top = target.getBoundingClientRect().top;
      const max = root.scrollHeight - window.innerHeight;
      return start + top < max ? top : max - start;
    })();
    if (delta)
      return new Map([
        ["start", start],
        ["delta", delta],
      ]);
  };

  const scroll = (link) => {
    const hash = link.getAttribute("href");
    const coordinates = getCoordinates(hash);
    if (!coordinates) return;

    const tick = (timestamp) => {
      progress.set("elapsed", timestamp - start);
      root.scrollTop = ease(...progress.values(), ...coordinates.values());
      progress.get("elapsed") < progress.get("duration")
        ? requestAnimationFrame(tick)
        : complete(hash, coordinates);
    };

    const progress = new Map([["duration", 800]]);
    const start = performance.now();
    requestAnimationFrame(tick);
  };

  const complete = (hash, coordinates) => {
    history.pushState(null, null, hash);
    root.scrollTop = coordinates.get("start") + coordinates.get("delta");
  };

  const attachHandler = (links, index) => {
    const link = links.item(index);
    link.addEventListener("click", (event) => {
      event.preventDefault();
      scroll(link);
    });
    if (index) return attachHandler(links, index - 1);
  };

  const links = document.querySelectorAll("a.scroll");
  const last = links.length - 1;
  if (last < 0) return;
  attachHandler(links, last);
});

/*
 * Validador de RUT y método que lo añade a JQuery Validate
 * fuente: https://gist.github.com/javiertapia/65176/eb207645cf1f8334855e2147d2f10cabad6280fa
 */

function validaRut(campo) {
  if (campo.length == 0) {
    return false;
  }
  if (campo.length < 8) {
    return false;
  }

  campo = campo.replace("-", "");
  campo = campo.replace(/\./g, "");

  var suma = 0;
  var caracteres = "1234567890kK";
  var contador = 0;
  for (var i = 0; i < campo.length; i++) {
    u = campo.substring(i, i + 1);
    if (caracteres.indexOf(u) != -1) contador++;
  }
  if (contador == 0) {
    return false;
  }

  var rut = campo.substring(0, campo.length - 1);
  var drut = campo.substring(campo.length - 1);
  var dvr = "0";
  var mul = 2;

  for (i = rut.length - 1; i >= 0; i--) {
    suma = suma + rut.charAt(i) * mul;
    if (mul == 7) mul = 2;
    else mul++;
  }
  res = suma % 11;
  if (res == 1) dvr = "k";
  else if (res == 0) dvr = "0";
  else {
    dvi = 11 - res;
    dvr = dvi + "";
  }
  if (dvr != drut.toLowerCase()) {
    return false;
  } else {
    return true;
  }
}

jQuery.validator.addMethod(
  "rut",
  function (value, element) {
    return this.optional(element) || validaRut(value);
  },
  "Revise el RUT"
);

/*
 * Validaciones del formulario mediante JQuery Validate
 */

$("#formulario-compra").validate({
  rules: {
    "txt-nombre": {
      required: true,
      lettersonly: true,
    },
    "txt-apellido": {
      required: true,
      lettersonly: true,
    },
    "txt-run": {
      required: true,
      rut: true,
    },
    "txt-email": {
      required: true,
      email: true,
    },
    "txt-fono": {
      required: true,
      number: true,
    },
    "txt-direccion": {
      required: true,
    },
    "cmb-region": {
      required: true,
    },
    "cmb-comuna": {
      required: true,
    },
  },
  messages: {
    "txt-nombre": {
      required: "Debe ingresar un nombre",
    },
    "txt-apellido": {
      required: "Debe ingresar un apellido",
    },
    "txt-run": {
      required: "Debe ingresar un RUN",
      rut: "Debe ser un RUN v&aacute;lido",
    },
    "txt-email": {
      required: "Debe ingresar un correo",
      email: "El formato del correo no est&aacute; correcto",
    },
    "txt-fono": {
      required: "Debe ingresar un tel&eacute;fono",
      number: "Solo debe ingresar n&uacute;meros",
    },
    "txt-direccion": {
      required: "Debe ingresar una direcci&oacute;n",
    },
    "cmb-region": {
      required: "Debe seleccionar una regi&oacute;n",
    },
    "cmb-comuna": {
      required: "Debe seleccionar una comuna",
    },
  },
});

/*
 * Generador de ComboBox para seleccionar regiones y sus comunas correspondientes
 * Fuente: https://codepen.io/sergiohidalgo/pen/yNjdqg
 */

 var RegionesYcomunas = {
  regiones: [
    {
      NombreRegion: "Arica y Parinacota",
      comunas: ["Arica", "Camarones", "Putre", "General Lagos"],
    },
    {
      NombreRegion: "Tarapacá",
      comunas: [
        "Iquique",
        "Alto Hospicio",
        "Pozo Almonte",
        "Camiña",
        "Colchane",
        "Huara",
        "Pica",
      ],
    },
    {
      NombreRegion: "Antofagasta",
      comunas: [
        "Antofagasta",
        "Mejillones",
        "Sierra Gorda",
        "Taltal",
        "Calama",
        "Ollagüe",
        "San Pedro de Atacama",
        "Tocopilla",
        "María Elena",
      ],
    },
    {
      NombreRegion: "Atacama",
      comunas: [
        "Copiapó",
        "Caldera",
        "Tierra Amarilla",
        "Chañaral",
        "Diego de Almagro",
        "Vallenar",
        "Alto del Carmen",
        "Freirina",
        "Huasco",
      ],
    },
    {
      NombreRegion: "Coquimbo",
      comunas: [
        "La Serena",
        "Coquimbo",
        "Andacollo",
        "La Higuera",
        "Paiguano",
        "Vicuña",
        "Illapel",
        "Canela",
        "Los Vilos",
        "Salamanca",
        "Ovalle",
        "Combarbalá",
        "Monte Patria",
        "Punitaqui",
        "Río Hurtado",
      ],
    },
    {
      NombreRegion: "Valparaíso",
      comunas: [
        "Valparaíso",
        "Casablanca",
        "Concón",
        "Juan Fernández",
        "Puchuncaví",
        "Quintero",
        "Viña del Mar",
        "Isla de Pascua",
        "Los Andes",
        "Calle Larga",
        "Rinconada",
        "San Esteban",
        "La Ligua",
        "Cabildo",
        "Papudo",
        "Petorca",
        "Zapallar",
        "Quillota",
        "Calera",
        "Hijuelas",
        "La Cruz",
        "Nogales",
        "San Antonio",
        "Algarrobo",
        "Cartagena",
        "El Quisco",
        "El Tabo",
        "Santo Domingo",
        "San Felipe",
        "Catemu",
        "Llaillay",
        "Panquehue",
        "Putaendo",
        "Santa María",
        "Quilpué",
        "Limache",
        "Olmué",
        "Villa Alemana",
      ],
    },
    {
      NombreRegion: "Región del Libertador Gral. Bernardo O’Higgins",
      comunas: [
        "Rancagua",
        "Codegua",
        "Coinco",
        "Coltauco",
        "Doñihue",
        "Graneros",
        "Las Cabras",
        "Machalí",
        "Malloa",
        "Mostazal",
        "Olivar",
        "Peumo",
        "Pichidegua",
        "Quinta de Tilcoco",
        "Rengo",
        "Requínoa",
        "San Vicente",
        "Pichilemu",
        "La Estrella",
        "Litueche",
        "Marchihue",
        "Navidad",
        "Paredones",
        "San Fernando",
        "Chépica",
        "Chimbarongo",
        "Lolol",
        "Nancagua",
        "Palmilla",
        "Peralillo",
        "Placilla",
        "Pumanque",
        "Santa Cruz",
      ],
    },
    {
      NombreRegion: "Región del Maule",
      comunas: [
        "Talca",
        "ConsVtución",
        "Curepto",
        "Empedrado",
        "Maule",
        "Pelarco",
        "Pencahue",
        "Río Claro",
        "San Clemente",
        "San Rafael",
        "Cauquenes",
        "Chanco",
        "Pelluhue",
        "Curicó",
        "Hualañé",
        "Licantén",
        "Molina",
        "Rauco",
        "Romeral",
        "Sagrada Familia",
        "Teno",
        "Vichuquén",
        "Linares",
        "Colbún",
        "Longaví",
        "Parral",
        "ReVro",
        "San Javier",
        "Villa Alegre",
        "Yerbas Buenas",
      ],
    },
    {
      NombreRegion: "Región del Biobío",
      comunas: [
        "Concepción",
        "Coronel",
        "Chiguayante",
        "Florida",
        "Hualqui",
        "Lota",
        "Penco",
        "San Pedro de la Paz",
        "Santa Juana",
        "Talcahuano",
        "Tomé",
        "Hualpén",
        "Lebu",
        "Arauco",
        "Cañete",
        "Contulmo",
        "Curanilahue",
        "Los Álamos",
        "Tirúa",
        "Los Ángeles",
        "Antuco",
        "Cabrero",
        "Laja",
        "Mulchén",
        "Nacimiento",
        "Negrete",
        "Quilaco",
        "Quilleco",
        "San Rosendo",
        "Santa Bárbara",
        "Tucapel",
        "Yumbel",
        "Alto Biobío",
        "Chillán",
        "Bulnes",
        "Cobquecura",
        "Coelemu",
        "Coihueco",
        "Chillán Viejo",
        "El Carmen",
        "Ninhue",
        "Ñiquén",
        "Pemuco",
        "Pinto",
        "Portezuelo",
        "Quillón",
        "Quirihue",
        "Ránquil",
        "San Carlos",
        "San Fabián",
        "San Ignacio",
        "San Nicolás",
        "Treguaco",
        "Yungay",
      ],
    },
    {
      NombreRegion: "Región de la Araucanía",
      comunas: [
        "Temuco",
        "Carahue",
        "Cunco",
        "Curarrehue",
        "Freire",
        "Galvarino",
        "Gorbea",
        "Lautaro",
        "Loncoche",
        "Melipeuco",
        "Nueva Imperial",
        "Padre las Casas",
        "Perquenco",
        "Pitrufquén",
        "Pucón",
        "Saavedra",
        "Teodoro Schmidt",
        "Toltén",
        "Vilcún",
        "Villarrica",
        "Cholchol",
        "Angol",
        "Collipulli",
        "Curacautín",
        "Ercilla",
        "Lonquimay",
        "Los Sauces",
        "Lumaco",
        "Purén",
        "Renaico",
        "Traiguén",
        "Victoria",
      ],
    },
    {
      NombreRegion: "Región de Los Ríos",
      comunas: [
        "Valdivia",
        "Corral",
        "Lanco",
        "Los Lagos",
        "Máfil",
        "Mariquina",
        "Paillaco",
        "Panguipulli",
        "La Unión",
        "Futrono",
        "Lago Ranco",
        "Río Bueno",
      ],
    },
    {
      NombreRegion: "Región de Los Lagos",
      comunas: [
        "Puerto Montt",
        "Calbuco",
        "Cochamó",
        "Fresia",
        "FruVllar",
        "Los Muermos",
        "Llanquihue",
        "Maullín",
        "Puerto Varas",
        "Castro",
        "Ancud",
        "Chonchi",
        "Curaco de Vélez",
        "Dalcahue",
        "Puqueldón",
        "Queilén",
        "Quellón",
        "Quemchi",
        "Quinchao",
        "Osorno",
        "Puerto Octay",
        "Purranque",
        "Puyehue",
        "Río Negro",
        "San Juan de la Costa",
        "San Pablo",
        "Chaitén",
        "Futaleufú",
        "Hualaihué",
        "Palena",
      ],
    },
    {
      NombreRegion: "Región Aisén del Gral. Carlos Ibáñez del Campo",
      comunas: [
        "Coihaique",
        "Lago Verde",
        "Aisén",
        "Cisnes",
        "Guaitecas",
        "Cochrane",
        "O’Higgins",
        "Tortel",
        "Chile Chico",
        "Río Ibáñez",
      ],
    },
    {
      NombreRegion: "Región de Magallanes y de la AntárVca Chilena",
      comunas: [
        "Punta Arenas",
        "Laguna Blanca",
        "Río Verde",
        "San Gregorio",
        "Cabo de Hornos (Ex Navarino)",
        "AntárVca",
        "Porvenir",
        "Primavera",
        "Timaukel",
        "Natales",
        "Torres del Paine",
      ],
    },
    {
      NombreRegion: "Región Metropolitana de Santiago",
      comunas: [
        "Cerrillos",
        "Cerro Navia",
        "Conchalí",
        "El Bosque",
        "Estación Central",
        "Huechuraba",
        "Independencia",
        "La Cisterna",
        "La Florida",
        "La Granja",
        "La Pintana",
        "La Reina",
        "Las Condes",
        "Lo Barnechea",
        "Lo Espejo",
        "Lo Prado",
        "Macul",
        "Maipú",
        "Ñuñoa",
        "Pedro Aguirre Cerda",
        "Peñalolén",
        "Providencia",
        "Pudahuel",
        "Quilicura",
        "Quinta Normal",
        "Recoleta",
        "Renca",
        "San Joaquín",
        "San Miguel",
        "San Ramón",
        "Vitacura",
        "Puente Alto",
        "Pirque",
        "San José de Maipo",
        "Colina",
        "Lampa",
        "TilVl",
        "San Bernardo",
        "Buin",
        "Calera de Tango",
        "Paine",
        "Melipilla",
        "Alhué",
        "Curacaví",
        "María Pinto",
        "San Pedro",
        "Talagante",
        "El Monte",
        "Isla de Maipo",
        "Padre Hurtado",
        "Peñaflor",
      ],
    },
  ],
};

jQuery(document).ready(function () {
  var iRegion = 0;
  var htmlRegion =
    '<option value="sin-region">Seleccione región</option><option value="sin-region">--</option>';
  var htmlComunas =
    '<option value="sin-region">Seleccione comuna</option><option value="sin-region">--</option>';

  jQuery.each(RegionesYcomunas.regiones, function () {
    htmlRegion =
      htmlRegion +
      '<option value="' +
      RegionesYcomunas.regiones[iRegion].NombreRegion +
      '">' +
      RegionesYcomunas.regiones[iRegion].NombreRegion +
      "</option>";
    iRegion++;
  });

  jQuery("#regiones").html(htmlRegion);
  jQuery("#comunas").html(htmlComunas);

  jQuery("#regiones").change(function () {
    var iRegiones = 0;
    var valorRegion = jQuery(this).val();
    var htmlComuna =
      '<option value="sin-comuna">Seleccione comuna</option><option value="sin-comuna">--</option>';
    jQuery.each(RegionesYcomunas.regiones, function () {
      if (RegionesYcomunas.regiones[iRegiones].NombreRegion == valorRegion) {
        var iComunas = 0;
        jQuery.each(RegionesYcomunas.regiones[iRegiones].comunas, function () {
          htmlComuna =
            htmlComuna +
            '<option value="' +
            RegionesYcomunas.regiones[iRegiones].comunas[iComunas] +
            '">' +
            RegionesYcomunas.regiones[iRegiones].comunas[iComunas] +
            "</option>";
          iComunas++;
        });
      }
      iRegiones++;
    });
    jQuery("#comunas").html(htmlComuna);
  });
  jQuery("#comunas").change(function () {
    if (jQuery(this).val() == "sin-region") {
      alert("selecciones Región");
    } else if (jQuery(this).val() == "sin-comuna") {
      alert("selecciones Comuna");
    }
  });
  jQuery("#regiones").change(function () {
    if (jQuery(this).val() == "sin-region") {
      alert("selecciones Región");
    }
  });
});
