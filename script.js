window.onload = () => {
  const svg_url = "atlas0.svg";
  const lesatlas = document.getElementById("lesatlas");
  const ref = document.getElementById("ref");

  var svgloaded = false;
  var imgloaded = false;
  
  var zip = new JSZip();

  const oReq = new XMLHttpRequest();
  oReq.addEventListener("load", function reqListener() {
    ref.appendChild(this.responseXML.documentElement);
    svgloaded = true;
    if (svgloaded && imgloaded) makeLesAtlas();
  });
  oReq.overrideMimeType("image/svg+xml");
  oReq.open("GET", svg_url);
  oReq.send();

  const imgref = new Image();
  imgref.onload = function () {
    var i = document.createElement("img");
    i.src = imgref.src;
    imgloaded = true;
    if (svgloaded && imgloaded) makeLesAtlas();
  };
  imgref.src = svg_url;

  function makeLesAtlas() {
    
    makeAtlas(100 / 100);
    makeAtlas(75 / 100);
    makeAtlas(50 / 100);
    makeAtlas(25 / 100);
    makeAtlas(10 / 100);
    
    zip.generateAsync({type:"base64"}).then(function (base64) {
        window.location = "data:application/zip;base64," + base64;
    }, function (err) {
        alert(err);
    });

  }

  function makeAtlas(rapport) {
    var divAtlas = document.createElement("div");
    var h3 = document.createElement("h3");
    var divDrawing = document.createElement("div");
    var divText = document.createElement("textarea");
    var divSprites = document.createElement("div");
    divAtlas.classList.add("atlas");
    divAtlas.style.flexGrow = rapport * 100;
    divDrawing.classList.add("drawing");
    divSprites.classList.add("sprites");
    divText.classList.add("atlasText");
    divText.value = "";
    h3.innerText = "atlas0_" + rapport * 100;

    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    canvas.width = imgref.width * rapport;
    canvas.height = imgref.height * rapport;
    ctx.drawImage( imgref, 0, 0, imgref.width, imgref.height, 0, 0, canvas.width, canvas.height );

    divText.style.maxWidth = canvas.width;

    divDrawing.appendChild(canvas);
    divAtlas.appendChild(h3);
    divAtlas.appendChild(divDrawing);
    divAtlas.appendChild(divText);
    divAtlas.appendChild(divSprites);
    lesatlas.appendChild(divAtlas);

    var atlas = {
      frames: {},
      meta: {
        app: "svgToAtlas_ProofOfConcept",
        version: "0.1",
        image: "atlas0_" + rapport * 100 + ".png",
        scale: "1",
        size: { w: imgref.width, h: imgref.height }
      }
    };

    var layer_sizes = document.getElementById("sizes");
    var layer_sprites = document.getElementById("sprites");
    var layer_blueprints = document.getElementById("blueprints");

    var groupes = layer_sizes.getElementsByTagName("rect");

    for (const groupe of groupes) {
      var name =
        "sprites/" + groupe.getAttribute("id").split("size_").join("") + ".png";
      var sprite = (atlas.frames[name] = {});
      sprite.frame = {};
      sprite.frame.x = Math.round(groupe.getAttribute("x") * rapport);
      sprite.frame.y = Math.round(groupe.getAttribute("y") * rapport);
      sprite.frame.w = Math.round(groupe.getAttribute("width") * rapport);
      sprite.frame.h = Math.round(groupe.getAttribute("height") * rapport);
      sprite.rotated = false;
      sprite.trimmed = false;
      sprite.spriteSourceSize = {};
      sprite.spriteSourceSize.x = 0;
      sprite.spriteSourceSize.y = 0;
      sprite.spriteSourceSize.w = sprite.frame.w;
      sprite.spriteSourceSize.h = sprite.frame.h;
      sprite.sourceSize = {};
      sprite.sourceSize.w = sprite.frame.w;
      sprite.sourceSize.h = sprite.frame.h;

      divSprites.appendChild(makeSprites(sprite, canvas, name));
    }

    divText.value = JSON.stringify(atlas);
    
    var savable = new Image();
    savable.src = canvas.toDataURL();
    zip.folder("res_built").folder("atlas").file("atlas0_" + rapport * 100 + ".png", savable, {base64: true});
    zip.folder("res_built").folder("atlas").file("atlas0_" + rapport * 100 + ".json", "Hello[p my)6cxsw2q");
  }

  function makeSprites(sprite, ref, name) {
    var fig = document.createElement("figure");
    var figcap = document.createElement("figcaption");
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    canvas.width = sprite.frame.w;
    canvas.height = sprite.frame.h;
    ctx.drawImage(
      ref,
      sprite.frame.x,
      sprite.frame.y,
      sprite.frame.w,
      sprite.frame.h,
      0,
      0,
      sprite.frame.w,
      sprite.frame.h
    );
    figcap.appendChild(document.createTextNode(name));
    fig.appendChild(canvas);
    fig.appendChild(figcap);

    return fig;
  }
  
};
