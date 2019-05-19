
var baseUrl = 'https://rest.ehrscape.com/rest/v1';
var queryUrl = baseUrl + '/query';

var username = "ois.seminar";
var password = "ois4fri";


/**
 * Generiranje niza za avtorizacijo na podlagi uporabniškega imena in gesla,
 * ki je šifriran v niz oblike Base64
 *
 * @return avtorizacijski niz za dostop do funkcionalnost
 */
function getAuthorization() {
  return "Basic " + btoa(username + ":" + password);
}

/**
 * Generator podatkov za novega pacienta, ki bo uporabljal aplikacijo. Pri
 * generiranju podatkov je potrebno najprej kreirati novega pacienta z
 * določenimi osebnimi podatki (ime, priimek in datum rojstva) ter za njega
 * shraniti nekaj podatkov o vitalnih znakih.
 * @param stPacienta zaporedna številka pacienta (1, 2 ali 3)
 * @return ehrId generiranega pacienta
 */
 
function generirajPodatke(stPacienta) {
 var ehrId = "";
	var ime="";
	var priimek="";
	var datumRojstva="";
	var ishrana="";
	var telesnaTemp="";
	var telesnaTeza="";
	var datumInUra="";
  var sisTlak="";
  var diTlak="";
	if(stPacienta==1){
		ime="Marek";
		priimek="Nošel";
		datumRojstva="1985-10-20T14:50";
		ishrana="vegan";
		telesnaTemp=37.2;
		telesnaTeza=88;
		datumInUra="2019-05-13T11:36";
	  sisTlak=135;
	  diTlak=99;
	  
	}
	else if(stPacienta==2){
		ime="Ivan";
		priimek="Sprina";
		datumRojstva="2005-10-02T06:36";
		ishrana="meso";
		telesnaTemp=39;
		telesnaTeza=57;
		datumInUra="2019-05-13T10:22";
    sisTlak=110;
	  diTlak=82;
	}
	else if(stPacienta==3){
		ime="Nataša";
		priimek="Oprič";
		datumRojstva="1959-05-06T16:55";
		ishrana="vegeterijan";
		telesnaTemp=36.5;
		telesnaTeza=68;
		datumInUra="2019-05-13T11:36";
    sisTlak=148;
	  diTlak=102;
	  }


	
		$.ajax({
		    url: baseUrl + "/ehr",
		    type: 'POST',
		    success: function (data) {
		        var ehrId = data.ehrId;
		        console.log("moj EHR: "+ehrId);
		        var partyData = {
		            firstNames: ime,
		            lastNames: priimek,
		            dateOfBirth: datumRojstva,
		            partyAdditionalInfo:[{key: "ehrId", value: ehrId}],
		        };
		        $.ajax({
		            url: baseUrl + "/demographics/party",
		            type: 'POST',
		            headers: {"Authorization": getAuthorization()},
		            contentType: 'application/json',
		            data: JSON.stringify(partyData),
		            success: function (party) {
		                if (party.action == 'CREATE') {
		                   $("#sporociGenerirano").html("<span class='obvestilo " +
                          "label label-success fade-in'>Uspešno kreirani EHR ID bolnikov.</span>");
		                	 $("#EHRid").val(ehrId);
		                
		                }
		            },
		        });
		        var option="<option value="+ehrId+">"+ime+" "+priimek+"</option>";
			    	$("#preberiEHRvitalno").append(option);
			     	var generirati = "<ul class='list-group'><li class='list-group-item list-group-item-success'>EhrId za pacienta "+ime+" "+priimek+": "+ehrId+"</li></ul>";
				    $("#sporociGenerirano").append(generirati);
		  }
		});
}
function generiri() {
  	$("#preberiEHRvitalno").html("");
  	$("#preberiEHRvitalno").append("<option value=''></option>");
  	$("#sporociGenerirano").html("");
  	
  	generirajPodatke(1);
  	generirajPodatke(2);
  	generirajPodatke(3);
}

function novEHR() {
 
    var ime=$("#novoIme").val();
    var priimek=$("#novPriimek").val();
    var datumRojstva=$("#novDR").val();
    var ishrana=$("#Ishrana").val();
    console.log("v kreiraj ehr: "+ishrana);
    if (!ime || !priimek || !datumRojstva || ime.trim().length == 0 ||
      priimek.trim().length == 0 || datumRojstva.trim().length == 0) {
		$("#sporoci").html("<span class='obvestilo label " +
      "label-warning fade-in'>Prosim vnesite zahtevane podatke!</span>");
     
      } else {

		$.ajaxSetup({
		    headers: {"Authorization": getAuthorization()},
		});
		$.ajax({
		    url: baseUrl + "/ehr",
		    type: 'POST',
		    success: function (data) {
		        var ehrId = data.ehrId;
		        var partyData = {
		            firstNames: ime,
		            lastNames: priimek,
		            dateOfBirth: datumRojstva,
		            partyAdditionalInfo: [{key: "ehrId", value: ehrId},  {
                        key: "ishrana",
                        value: ishrana
                    },]
		        };
		        $.ajax({
		            url: baseUrl + "/demographics/party",
		            type: 'POST',
		            headers: {
                  "Authorization": getAuthorization()
                 },
		            contentType: 'application/json',
		            data: JSON.stringify(partyData),
		            success: function (party) {
		                if (party.action == 'CREATE') {
		                    $("#sporoci").html("<span class='obvestilo " +
                          "label label-success fade-in'>EHR zapis: '" +
                          ehrId + "'.</span>");
		                    $("#EHRid").val(ehrId);
		                   
		                }
		            },
		            error: function(err) {
		            	$("#sporoci").html("<span class='obvestilo label " +
                    "label-danger fade-in'>Napaka '" +
                    JSON.parse(err.responseText).userMessage + "'!");
		            }
		        });
		    }
		});
    }
	
}


function dodajMeritve() {
   
  var ehrId = $("#dodajEHR").val();
	var datumInUra = $("#dodajDUro").val();
	var telesnaTemp= $("#dodajTemp").val();
	var telesnaTeza = $("#dodajTTezo").val();
	var sisTlak= $("#dodajSiTlak").val();
	var diTlak= $("#dodajDiTlak").val();
 
 if (!ehrId || ehrId.trim().length == 0) {
		$("#meritveVitalSpor").html("<span class='obvestilo " +
      "label label-warning fade-in'>Prosim vnesite zahtevane podatke!</span>");
	} else {
		var podatki = {
			
		    "ctx/language": "en",
		    "ctx/territory": "SI",
		    "ctx/time": datumInUra,
		    "vital_signs/body_temperature/any_event/temperature|magnitude": telesnaTemp ,
		    "vital_signs/body_temperature/any_event/temperature|unit": "°C",
		    "vital_signs/body_weight/any_event/body_weight": telesnaTeza,
		    "vital_signs/blood_pressure/any_event/systolic": sisTlak,
		    "vital_signs/blood_pressure/any_event/systolic|unit":"mm[Hg]",
		    "vital_signs/blood_pressure/any_event/diastolic": diTlak,
		    "vital_signs/blood_pressure/any_event/diastolic|unit":"mm[Hg]",
		};
		var parametriZahteve = {
		    "ehrId": ehrId,
		    templateId: 'Vital Signs',
		    format: 'FLAT',
		    
		};

		$.ajax({
		    url: baseUrl + "/composition?" + $.param(parametriZahteve),
		    type: 'POST',
		    contentType: 'application/json',
		    data: JSON.stringify(podatki),
		     headers: {
        "Authorization": getAuthorization()
        },
		    success: function (res) {
		        $("#meritveVitalSpor").html(
              "<span class='obvestilo label label-success fade-in'>" +
              res.meta.href + ".</span>");
		    },
		    error: function(err) {
		    	$("#meritveVitalSpor").html(
            "<span class='obvestilo label label-danger fade-in'>Napaka '" +
            JSON.parse(err.responseText).userMessage + "'!");
		    }
		});
	}
}

var pacientIme=""; var pacientPriimek=""; var pacientDR=""; var pacientIshrana=""; var pacientDUra=""; var pacientTemp=0; var pacientTeza=0; var pacientSiTlak=0; var pacientDiTlak=0;
var pacientdodatno="";

function analizirajMeritve() {
  
    var pacient1=$("#pacientIme").val();
    var pacient2=$("#pacientPriimek").val();
    var ehrid = $("#EHRid").val();
    var podatek=1;
     if (!ehrid) {
        $("#obvestiloanaliza").html("<div class='alert alert-danger alert-dismissible' role='alert'><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button>Prosimo vnesite EHR ID pacienta.</div>");
        podatek=-1;
     } else {
        $.ajax({
            url: baseUrl + "/demographics/ehr/" + ehrid + "/party",
            type: 'GET',
            headers: {
                 "Authorization": getAuthorization()
            },

            success: function(data) {

                var party = data.party;
                pacientIme = party.firstNames;
                pacientPriimek = party.lastNames;
                pacientDR = party.dateOfBirth;
                pacientDUra=party.time;
                pacientdodatno=party.partyAdditionalInfo;
                $.ajax({
                    url: baseUrl + "/view/" + ehrid + "/" + "body_temperature",
                    type: 'GET',
                    headers: {
                         "Authorization": getAuthorization()
                    },
                    success: function(res) {
                       
                        if (res.length > 0) {
                         
  				             pacientDUra = res[0].time;
  				             pacientTemp = res[0].temperature; 
                           var results= "<tr><td width='80%' >"  + pacientTemp +
                            " " + res[0].unit + "</td></tr>";
  				     
                           $("#rezultat").append(results);
                        } else {
                            alert("NI PODATKA O TEMPERATURI");
                        }
                         analizaTemp(pacientTemp);
                    },
                   
                });

                $.ajax({
                    url: baseUrl + "/view/" + ehrid + "/" + "weight",
                    type: 'GET',
                    headers: {
                        "Authorization": getAuthorization()
                    },
                    success: function(res) {
                     
                        if (res.length > 0) {
                            pacientTeza = res[0].weight;
                           var rezz= "<tr><td width='80%' >"  + pacientTeza +
                            " " + res[0].unit + "</td></tr>";
                            $("#rezzo").append(rezz);
                        }
                        else {
                            alert("NI PODATKA O TEŽI.");
                        }
                    },
                   
                });
                $.ajax({
                    url: baseUrl + "/view/" + ehrid + "/" + "blood_pressure",
                    type: 'GET',
                    headers: {
                        "Authorization": getAuthorization()
                    },
                    success: function(res) {
                     
                        if (res.length > 0) {
                            pacientSiTlak = res[0].systolic;
                            pacientDiTlak = res[0].diastolic;
                            var nesto= "<tr><td width='80%' >"  + pacientSiTlak +
                            " " + res[0].unit + "</td></tr>";
  				           
                           $("#rez").append(nesto);
                         
                        }
                        else {
                            alert("NI PODATKA O TLAKU.");

                        }
                       analizaSist(pacientSiTlak);

                    },
                   
                });
                 $.ajax({
                    url: baseUrl + "/view/" + ehrid + "/" + "blood_pressure",
                    type: 'GET',
                    headers: {
                        "Authorization": getAuthorization()
                    },
                    success: function(res) {
                        if (res.length > 0) {
                            pacientSiTlak = res[0].systolic;
                            pacientDiTlak = res[0].diastolic;
                            
  				            var ditlakk= "<tr><td width='80%' >"  + pacientDiTlak +
                            " " + res[0].unit + "</td></tr>";
                           $("#rez2").append(ditlakk);
                       
                        }
                        else {
                            alert("NI PODATKA O TLAKU.");
                        }
                       analizaDiast(pacientDiTlak);

                    },
                   
                });
            },
            
        });

      

    }
}
function ishranaPacienta(hrana) {
 
        switch (hrana) {
            case 'meso':
                $("#hranainfo").html("<b>Ishrana:</b> Mesojedec");
                $("#hranainfo").css("color", "#5cb85c");
                $("#hranaINFO").css("display", "none");
                break;
            case 'vegeterijan':
                $("#hranainfo").html("<b>Ishrana:</b> Vegeterijanec");
                $("#hranainfo").css("color", "#d9534f");
                $("#hranaINFO").css("display", "block");
               
                break;
            case 'vegan':
                $("#hranainfo").html("<b>Ishrana:</b> Vegan");
                $("#hranainfo").css("color", "#f0ad4e");
                $("#hranaINFO").css("display", "block");
               
                break;
            default:
                break;
        }
}
function analizaTemp(temp) {
    if (temp < 36.4) {
        $("#obavestenjetemp").html("<span class='obvestilo label label-warning fade-in' data-toggle='tooltip' data-placement='top' title='Normalna vrednost: 36.4 - 37.2'>" + temp + ", temperatura je prenizka" + ".</span>");
    }
    else if (temp >= 36.4 && temp <= 37.2) {
        $("#obavestenjetemp").html("<span class='obvestilo label label-success fade-in' data-toggle='tooltip' data-placement='top' title='Normalna vrednost: 36.4 - 37.2'>" + temp + ", temperatura je normalna" + ".</span>");

    }
    else if (temp > 37.2) {
        $("#obavestenjetemp").html("<span class='obvestilo label label-warning fade-in' data-toggle='tooltip' data-placement='top' title='Normalna vrednost: 36.4 - 37.2'>" + temp + ", temperatura je visoka" + ".</span>");

    }
}
function analizaSist(syst) {
    if (syst < 90) {
        $("#obavestenjesys").html("<span class='obvestilo label label-warning fade-in' data-toggle='tooltip' data-placement='top' title='Idealna vrednost: 90 - 120 mm/Hg' >" + syst + ", sistolični tlak je prenizek" + ".</span>");
    }
    else if (syst >= 90 && syst <= 120) {
        $("#obavestenjesys").html("<span class='obvestilo label label-success fade-in' data-toggle='tooltip' data-placement='top' title='Idealna vrednost: 90 - 120 mm/Hg' >" + syst + ", sistolični tlak je normalen" + ".</span>");

    }
    else if (syst > 120 && syst < 140) {
        $("#obavestenjesys").html("<span class='obvestilo label label-warning fade-in' data-toggle='tooltip' data-placement='top' title='Idealna vrednost: 90 - 120 mm/Hg' >" + syst + ", sistolični tlak je visok" + ".</span>");

    }
    else {
        $("#obavestenjesys").html("<span class='obvestilo label label-danger fade-in' data-toggle='tooltip' data-placement='top' title='Idealna vrednost: 90 - 120 mm/Hg' >" + syst + ", sistolični tlak je previsok" + ".</span>");

    }
}

//DIASTOLIC
function analizaDiast(diast) {
    if (diast < 60) {
        $("#obavestenjedi").html("<span class='obvestilo label label-warning fade-in' data-toggle='tooltip' data-placement='top' title='Idealna vrednost: 60 - 80 mm/Hg' >" + diast + ", diastolični tlak je prenizek" + ".</span>");
    }
    else if (diast >= 60 && diast <= 80) {
        $("#obavestenjedi").html("<span class='obvestilo label label-success fade-in' data-toggle='tooltip' data-placement='top' title='Idealna vrednost: 60 - 80 mm/Hg' >" + diast + ", diastolični tlak je normalen" + ".</span>");
    }
    else if (diast > 80 && diast < 90) {
        $("#obavestenjedi").html("<span class='obvestilo label label-warning fade-in' data-toggle='tooltip' data-placement='top' title='Idealna vrednost: 60 - 80 mm/Hg' >" + diast + ", diastolični tlak je visok" + ".</span>");

    }
    else {
        $("#obavestenjedi").html("<span class='obvestilo label label-danger fade-in' data-toggle='tooltip' data-placement='top' title='Idealna vrednost: 60 - 80 mm/Hg' >" + diast + ", diastolični tlak je previsok" + ".</span>");

    }
}


// TODO: Tukaj implementirate funkcionalnost, ki jo podpira vaša aplikacija
$(document).ready(function() {
      $('#dropdown').change(function() {
        
      $("#sporoci").html("");
      var podatki = $(this).val().split(",");
      $("#novoIme").val(podatki[0]);
      $("#novPriimek").val(podatki[1]);
      $("#novDR").val(podatki[2]);
      $("#Ishrana").val(podatki[3]);
      });
     
    

      $("#dodajMeritev").click(function() {
     
      $("#meritveVitalSpor").html("");
	  	var podatki = $(this).val().split(",");
	  	$("#dodajEHR").val(podatki[0]);
	  	$("#dodajDUro").val(podatki[1]);
	  	$("#dodajTemp").val(podatki[2]);
	  	$("#dodajTTezo").val(podatki[3]);
	  	$("#dodajSiTlak").val(podatki[4]);
	  	$("#dodajDiTlak").val(podatki[5]);
	  
      });
      $("#podatkiOpacientu").click(function() {
         $("#obvestiloanaliza").html("");
         $("#rezultat").html("");
         $("#rez").html("");
         $("#rez2").html("");
         $("#rezzo").html("");
         $("#EHRid").val($(this).val());
         $("#pacientIme").val($(this).val());
        $("#prezime").val($(this).val());
         $("#pacDR").val("#pacientDR");
         var pacDura=$("#pacientDUra").val();
   
    
      });
     
     
    

});
