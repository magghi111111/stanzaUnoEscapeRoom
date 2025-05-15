$(document).ready(function () {
    // Timer e contatore indizi
    let hintCount = 0;
    const maxHints = 3;  // limite globale di indizi
    $('#nextRoom').hide()
    

    // Utility: gestione contatore indizi globale
    function incrementHint() {
        hintCount++;
        $('#hintCounter').text(`Indizi usati: ${hintCount}`);
        if (hintCount >= maxHints) {
            $('button[id^="hint"]').prop('disabled', true).text('Limite indizi raggiunto');
        }
    }
    function canGiveHint() {
        return hintCount < maxHints;
    }

    // Gestione progress bar
    const completion = [false, false, false];
    function updateProgress() {
        const done = completion.filter(Boolean).length;
        const perc = Math.round((done / 3) * 100);
        $('#progressBar').css('width', `${perc}%`).css('background', done === 3 ? 'green' : 'yellow');
        if (done === 3) {
            //clearInterval(timer)
            $('#nextRoom').show()
            localStorage.setItem('escapeRoomProgress', 1);
        };
    }
    $('#nextRoom').click(function(){
        window.location.href = "../room2/index.html";
    })



    // --- Gioco1: Ordina le reti ---
var correctOrder = ['PAN', 'LAN', 'WLAN', 'MAN', 'WAN', 'GAN'];

// DRAG & DROP
$('.event').on('dragstart', function (e) {
    var draggedItem = $(this);
    e.originalEvent.dataTransfer.setData('text/plain', draggedItem.attr('id'));
    // Blocca il drag se l'elemento è stato bloccato dal suggerimento
    if (draggedItem.hasClass('hint-locked')) {
        e.preventDefault();
        return;
    }

    //e.originalEvent.dataTransfer.setData('text/plain', draggedItem.attr('id'));
});

$('.slot').on('dragover', function (e) {
    e.preventDefault(); // Permette il drop
});

$('.slot').on('drop', function (e) {
    e.preventDefault();
    var dataTransfer = e.originalEvent.dataTransfer;
    var draggedId = dataTransfer.getData('text/plain');
    var draggedItem = $('#' + draggedId);
    var slot = $(this);
    var existing = slot.children().first();

    // Impedisci sovrascrittura se già presente un suggerimento bloccato
    if (existing.hasClass('hint-locked')) return;

    // Se c'è un altro elemento nello slot, rimettilo nel contenitore
    if (existing.length > 0) {
        $('#eventsContainer').append(existing);
    }

    slot.append(draggedItem);
});



    // CHECK ORDINE
    $('#checkOrderBtn').on('click', function () {
        var placed = [];

        $('.slot').each(function () {
            var text = $(this).text().trim();
            placed.push(text);
        });

        var isCorrect = true;

        if (placed.length !== correctOrder.length) {
            isCorrect = false;
        } else {
            for (var i = 0; i < correctOrder.length; i++) {
                if (placed[i] !== correctOrder[i]) {
                    isCorrect = false;
                    break;
                }
            }
        }

        if (isCorrect) {
            $('#result1').text('✅ Ordine corretto!').css('color', 'lime');
            if (!completion[0]) {
                completion[0] = true;
                updateProgress();
                $('#hint1').prop('disabled', true);
            }
        } else {
            $('#result1').text('❌ Ordine errato. Riprova.').css('color', 'red');
        }
    });

    // HINT
    $('#hint1').on('click', function () {
        if (!canGiveHint()) return;
    
        var placedIds = [];
    
        $('.slot').each(function () {
            var child = $(this).children().first();
            if (child.length > 0) {
                placedIds.push(child.attr('id'));
            }
        });
    
        var remaining = [];
    
        for (var i = 0; i < correctOrder.length; i++) {
            var id = correctOrder[i];
            if ($.inArray(id, placedIds) === -1) {
                remaining.push(id);
            }
        }
    
        if (remaining.length === 0) return;
    
        var randomIndex = Math.floor(Math.random() * remaining.length);
        var randomId = remaining[randomIndex];
        var item = $('#' + randomId);
        var targetIndex = $.inArray(randomId, correctOrder);
        var slot = $('.slot').eq(targetIndex);
        var existing = slot.children().first();
    
        if (existing.length > 0) {
            $('#eventsContainer').append(existing);
        }
    
        slot.append(item);
        slot.addClass('hint-highlight');
        item.attr('draggable', 'false').addClass('hint-locked');
    
        incrementHint();
    });
    

    // Gioco 2: Costruisci la rete
    var richieste = [['sw2', 'sw1'], ['sw3', 'sw1']];
    var pc = ['pc1', 'pc2', 'pc3', 'pc4', 'pc5'];
    var connessioni = [];
    var selezionato = null;
    var area = $('#workspace');

    // Posiziona i dispositivi in modo casuale
    $('.device').each(function () {
        var maxX = area.width() - $(this).outerWidth();
        var maxY = area.height() - $(this).outerHeight();
        var posizioneX = Math.random() * maxX;
        var posizioneY = Math.random() * maxY;
        $(this).css({ left: posizioneX, top: posizioneY });
    });

    // Funzione per aggiornare le linee di connessione tra dispositivi
function aggiornaLinee() {
    // Ottieni l'elemento SVG che contiene le linee
    var svg = $('#svgLines')[0];

    // Ottieni le coordinate dell'area in cui sono posizionati i dispositivi
    var areaRett = area[0].getBoundingClientRect();

    // Pulisci il contenuto precedente dell'SVG
    svg.innerHTML = '';

    // Cicla su tutte le connessioni esistenti
    for (var i = 0; i < connessioni.length; i++) {
        // ID dei due elementi connessi
        var idElementoA = connessioni[i][0];
        var idElementoB = connessioni[i][1];

        // Ottieni il rettangolo che rappresenta la posizione e dimensione dei due elementi
        var rettA = $('#' + idElementoA)[0].getBoundingClientRect();
        var rettB = $('#' + idElementoB)[0].getBoundingClientRect();

        // Calcola le coordinate centrali relative all'area
        var x1 = rettA.left + rettA.width / 2 - areaRett.left;
        var y1 = rettA.top + rettA.height / 2 - areaRett.top;
        var x2 = rettB.left + rettB.width / 2 - areaRett.left;
        var y2 = rettB.top + rettB.height / 2 - areaRett.top;

        // Crea una nuova linea SVG
        var linea = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        linea.setAttribute('stroke', '#00ffcc'); // colore della linea
        linea.setAttribute('stroke-width', '2'); // spessore
        linea.setAttribute('x1', x1);
        linea.setAttribute('y1', y1);
        linea.setAttribute('x2', x2);
        linea.setAttribute('y2', y2);

        // Aggiungi la linea all'SVG
        svg.appendChild(linea);
    }
}

    // Trascinamento dispositivi
    $('.device').on('mousedown', function (e) {
        e.preventDefault();

        var dispositivo = $(this);
        var offset = area.offset();
        var inizioX = e.pageX - offset.left - dispositivo.position().left;
        var inizioY = e.pageY - offset.top - dispositivo.position().top;

        $(document).on('mousemove.trascina', function (e) {
            var x = e.pageX - offset.left - inizioX;
            var y = e.pageY - offset.top - inizioY;

            x = Math.max(0, Math.min(x, area.width() - dispositivo.outerWidth()));
            y = Math.max(0, Math.min(y, area.height() - dispositivo.outerHeight()));

            dispositivo.css({ left: x + 'px', top: y + 'px' });

            aggiornaLinee();
        }).one('mouseup.trascina', function () {
            $(document).off('mousemove.trascina');
        });
    });

    // Doppio clic per collegare dispositivi
    $('.device').on('dblclick', function () {
        var id = this.id;

        if (!selezionato) {
            selezionato = id;
            $(this).css('border-color', 'yellow');
        } else if (selezionato === id) {
            $(this).css('border-color', '#00ffcc');
            selezionato = null;
        } else {
            connessioni.push([selezionato, id]);
            $('#' + selezionato).css('border-color', '#00ffcc');
            selezionato = null;
            aggiornaLinee();
        }
    });

    // Testa la rete
    $('#testNetworkBtn').on('click', function () {
        var okSwitch = richieste.every(function (richiesta) {
            return connessioni.some(function (c) {
                return (c[0] === richiesta[0] && c[1] === richiesta[1]) || (c[0] === richiesta[1] && c[1] === richiesta[0]);
            });
        });

        var okPc = pc.every(function (nomePc) {
            return connessioni.some(function (c) {
                return (c[0] === nomePc && (c[1] === 'sw2' || c[1] === 'sw3')) || (c[1] === nomePc && (c[0] === 'sw2' || c[0] === 'sw3'));
            });
        });

        if (okSwitch && okPc) {
            $('#result2').text('✅ Rete corretta!').css('color', 'lime');
            if (!completion[1]) {
                completion[1] = true;
                updateProgress();
                $('#hint2').prop('disabled', true);
            }
        } else {
            $('#result2').text('❌ Connessioni errate. Riprova.').css('color', 'red');
            connessioni = [];
            $('#svgLines').empty();
        }
    });

    // Suggerimento
    $('#hint2').on('click', function () {
        if (!canGiveHint())
            return;

        var collegamentiSwitch = connessioni.filter(function (c) {
            return c.includes('sw1') && (c.includes('sw2') || c.includes('sw3'));
        }).length;

        var collegamentiPc = connessioni.filter(function (c) {
            return (pc.includes(c[0]) && (c[1] === 'sw2' || c[1] === 'sw3')) || (pc.includes(c[1]) && (c[0] === 'sw2' || c[0] === 'sw3'));
        }).length;

        var messaggio;

        if (collegamentiSwitch === 0) {
            messaggio = 'Suggerimento: inizia collegando Switch A e Switch B al Switch CNTRL.';
        } else if (collegamentiPc === 0) {
            messaggio = 'Ottimo! Ora collega almeno un PC a uno dei due switch intermedi.';
        } else {
            messaggio = 'Quasi fatto: assicurati che ogni PC sia connesso a uno switch intermedio.';
        }

        $('#hintText2').text(messaggio);
        incrementHint();
    });


    // --- Gioco3: Wordle ---
    const parole = ["MAGLIA", "ANELLO", "ROUTER", "SWITCH", "STELLA"];
    const definitions = {
        MAGLIA: "Topologia di rete in cui ogni nodo è collegato a tutti gli altri, garantendo alta ridondanza.",
        ANELLO: "Topologia in cui i dispositivi sono connessi in sequenza formando un circuito chiuso.",
        ROUTER: "Dispositivo che instrada i pacchetti dati tra reti diverse, determinando il percorso migliore.",
        SWITCH: "Apparecchio di rete che riceve, analizza e inoltra pacchetti in base agli indirizzi MAC.",
        STELLA: "Topologia in cui ogni dispositivo è collegato a un nodo centrale che funge da punti di smistamento.",
    };

    let obiettivo, tentativi;

    function nuovoGioco() {
        obiettivo = parole[Math.floor(Math.random() * parole.length)];
        tentativi = 0;
        if (completion[2])
            completion[2] = false;
        $('#tabellaWordle td').removeClass('verde giallo grigio').text('');

        $('#inputWordle').val('').prop('disabled', false);

        $('#bottoneWordle').prop('disabled', false);

        if(hintCount!=maxHints){
            $('#hint3').prop('disabled', false).text('Suggerimento');
        }
        

        $('#risultatoWordle').text('').css('color', '');

        $('#hintText3').text('');
    }

    let tabella = '<table>';
    for (let r = 0; r < 6; r++) {
        tabella += '<tr>';
        for (let c = 0; c < 6; c++) {
            tabella += `<td id="w${r * 6 + c}"></td>`;
        }
        tabella += '</tr>';
    }
    tabella += '</table>';
    $('#tabellaWordle').html(tabella);

    $(document).ready(nuovoGioco);

    $('#inputWordle').on('keydown', e => { if (e.key === 'Enter') $('#bottoneWordle').click(); });

    $('#bottoneWordle').on('click', function () {
        const val = $('#inputWordle').val().toUpperCase();
        if (val.length !== 6) {
            alert('La parola deve contenere 6 lettere!');
            return;
        }

        for (let i = 0; i < 6; i++) {
            const l = val[i]; const idx = tentativi * 6 + i;
            if (l === obiettivo[i])
                $('#w' + idx).text(l).addClass('verde');
            else if (obiettivo.includes(l))
                $('#w' + idx).text(l).addClass('giallo');
            else
                $('#w' + idx).text(l).addClass('grigio');
        }

        if (val === obiettivo) {
            $('#risultatoWordle').text('✅ Hai vinto!').css('color', 'lime');
            $('#inputWordle,#bottoneWordle,#hint3').prop('disabled', true);

            if (!completion[2]) {
                completion[2] = true;
                updateProgress();
            }
        } else {
            tentativi++;
            $('#inputWordle').val('');
            if (tentativi >= 6) {
                $('#risultatoWordle').text('❌ Hai perso! La parola era: ' + obiettivo).css('color', 'red');
                $('#inputWordle,#bottoneWordle,#hint3').prop('disabled', true);
                setTimeout(nuovoGioco, 1500);
            }
        }
    });

    $('#hint3').on('click', function () {
        if (!canGiveHint())
            return;
        $('#hintText3').text('🛈 Definizione: ' + definitions[obiettivo]);
        incrementHint();
        // Disabilita il singolo indizio per parola
        $(this).prop('disabled', true).text('Indizio usato');
    });
});