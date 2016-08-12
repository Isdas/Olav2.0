function define(name, value) {
    Object.defineProperty(exports, name, {
        value: value,
        enumerable: true
    })
}

define("noSolution", 'Jeg beklager, men jeg kan ikke hjelpe deg. Ring Olav 1.0')
define("problems", '{ "problems" : [' +
    '{ "problem":"Jeg får hvit grafikk når jeg lager ny modell" , "solution":"Installer 2017-utgaven", "matchNumber":"", "isUsed" : "" },' +
    '{ "problem":"Jeg får hvit grafikk når jeg lager ny modell" , "solution":"Oppdater grafikkortdriveren", "matchNumber":"", "isUsed" : "" },' +
    '{ "problem":"Hvit grafikk når jeg installerer programmet" , "solution":"Oppdater grafikkortdriveren", "matchNumber":"", "isUsed" : "" },' +
    '{ "problem":"Error in MModel.Do(...). Command: Kjør analyse Could not load file or assembly OOCfem_x64.dll or one of its dependencies. Den angitte modulen ble ikke funnet" , "solution":"Reinstaller programmet med seneste versjon fra Min side.", "matchNumber":"", "isUsed" : "" },' +
    '{ "problem":"Har programmet vårt noen måter å regne på utsparinger i bjelker, søyler eller segmenter?" , "solution":"Nei. Det er ikke mulig å analysere segmenter (bjelker og søyler) med utsparinger", "matchNumber":"", "isUsed" : "" },' +
    '{ "problem":"Får ikke startet programmet etter oppgradering til Windows 10" , "solution":"Lisensen må frigjøres", "matchNumber":"", "isUsed" : "" } ]}')