var users = [
            { id: 1, email: 'admin@conference.com', password: 'admin123', role: 'administrator', name: 'Nikola Mugosa' },
            { id: 2, email: 'organizator@conference.com', password: 'org123', role: 'organizator', name: 'Petar Petrović' },
            { id: 3, email: 'korisnik@conference.com', password: 'user123', role: 'korisnik', name: 'Marko Marković' },
            { id: 4, email: 'ana@email.com', password: 'ana123', role: 'korisnik', name: 'Ana Jovanović' }
        ];

        var events = [
            { id: 1, title: 'Tech Summit Podgorica 2025', description: 'Najveća tehnološka konferencija u Crnoj Gori okuplja vodeće stručnjake iz oblasti vještačke inteligencije, cloud computinga i cyber sigurnosti.', date: '2025-10-15', time: '09:00', location: 'Hotel Hilton', city: 'Podgorica', capacity: 150, organizerId: 2, status: 'active', price: 35, category: 'Tehnologija', eventType: 'Konferencija' },
            { id: 2, title: 'FK Budućnost - FK Sutjeska', description: 'Derby crnogorskog fudbala između dva najveća rivala donosi nezaboravnu atmosferu na Stadionu pod Goricom.', date: '2025-11-10', time: '18:00', location: 'Stadion pod Goricom', city: 'Podgorica', capacity: 400, organizerId: 2, status: 'active', price: 15, category: 'Sport', eventType: 'Utakmica' },
            { id: 3, title: 'Sea Dance Festival 2025', description: 'Legendarni muzički festival na Jaz plaži privlači najbolje svjetske DJ-eve i izvođače elektronske muzike.', date: '2025-08-20', time: '18:00', location: 'Jaz plaža', city: 'Budva', capacity: 800, organizerId: 2, status: 'active', price: 60, category: 'Kultura', eventType: 'Festival' },
            { id: 4, title: 'Kotor Art Festival', description: 'Međunarodni festival umjetnosti u magičnom ambijentu starog grada Kotora.', date: '2025-09-05', time: '19:00', location: 'Stari grad Kotor', city: 'Kotor', capacity: 300, organizerId: 2, status: 'active', price: 20, category: 'Kultura', eventType: 'Festival' },
            { id: 5, title: 'Montenegro Wine Fest', description: 'Ekskluzivna vinska manifestacija koja okuplja najbolje vinare iz Crne Gore i regiona.', date: '2025-10-20', time: '17:00', location: 'Plantaže 13. Jul Podgorica', city: 'Podgorica', capacity: 200, organizerId: 2, status: 'active', price: 45, category: 'Kultura', eventType: 'Festival' }
        ];

        var reservations = [
            { id: 1, eventId: 1, userId: 4, userName: 'Ana Jovanović', reservationDate: '2025-10-01', status: 'confirmed', price: 35, quantity: 1 },
            { id: 2, eventId: 2, userId: 4, userName: 'Ana Jovanović', reservationDate: '2025-10-01', status: 'confirmed', price: 15, quantity: 1 },
            { id: 3, eventId: 3, userId: 4, userName: 'Ana Jovanović', reservationDate: '2025-10-01', status: 'confirmed', price: 60, quantity: 1 },
            { id: 4, eventId: 4, userId: 4, userName: 'Ana Jovanović', reservationDate: '2025-10-01', status: 'confirmed', price: 20, quantity: 1 },
            { id: 5, eventId: 5, userId: 4, userName: 'Ana Jovanović', reservationDate: '2025-10-01', status: 'confirmed', price: 45, quantity: 1 }
        ];

        var resellListings = [
            { id: 1, reservationId: 1, price: 30, listedDate: '2025-10-02' },
            { id: 2, reservationId: 2, price: 12, listedDate: '2025-10-02' },
            { id: 3, reservationId: 3, price: 50, listedDate: '2025-10-02' },
            { id: 4, reservationId: 4, price: 18, listedDate: '2025-10-02' },
            { id: 5, reservationId: 5, price: 40, listedDate: '2025-10-02' }
        ];

        var customTickets = [];
        var currentUser = null;
        var reservingEventId = null;
        var currentEventPrice = 0;
        var editingEventId = null;

        function showAlert(containerId, message, type) {
            var container = document.getElementById(containerId);
            if (!container) return;
            container.innerHTML = '<div class="alert alert-' + type + '">' + message + '</div>';
            setTimeout(function() { container.innerHTML = ''; }, 3500);
        }

        function showLogin() {
            document.getElementById('loginView').classList.remove('hidden');
            document.getElementById('registerView').classList.add('hidden');
            document.getElementById('userView').classList.add('hidden');
        }

        function showRegister() {
            document.getElementById('registerView').classList.remove('hidden');
            document.getElementById('loginView').classList.add('hidden');
        }

        function doLogin() {
            var email = document.getElementById('loginEmail').value;
            var password = document.getElementById('loginPassword').value;
            if (!email || !password) {
                showAlert('alertContainer', 'Molimo unesite email i lozinku', 'error');
                return;
            }
            
            var user = users.find(function(u) { return u.email === email && u.password === password; });
            if (user) {
                currentUser = user;
                
                // Sakrij sve view-ove prvo
                document.getElementById('loginView').classList.add('hidden');
                document.getElementById('userView').classList.add('hidden');
                document.getElementById('organizerView').classList.add('hidden');
                document.getElementById('adminView').classList.add('hidden');
                
                // Prikaži odgovarajući view
                if (user.role === 'administrator') {
                    document.getElementById('adminName').textContent = user.name;
                    document.getElementById('adminView').classList.remove('hidden');
                    loadAdminData();
                } else if (user.role === 'organizator') {
                    document.getElementById('organizerName').textContent = user.name;
                    document.getElementById('organizerView').classList.remove('hidden');
                    loadOrganizerEvents();
                } else {
                    document.getElementById('userName').textContent = user.name;
                    document.getElementById('userView').classList.remove('hidden');
                    loadEvents();
                }
            } else {
                showAlert('alertContainer', 'Pogrešni pristupni podaci', 'error');
            }
        }

        function loadOrganizerEvents() {
            var myEvents = events.filter(function(e) { return e.organizerId === currentUser.id; });
            var container = document.getElementById('organizerEventsList');
            
            if (myEvents.length === 0) {
                container.innerHTML = '<div class="event-card">Nemate kreiranih događaja</div>';
                return;
            }

            var html = '';
            for (var i = 0; i < myEvents.length; i++) {
                var e = myEvents[i];
                var res = reservations.filter(function(r) { return r.eventId === e.id; });
                
                html += '<div class="event-card">';
                html += '<div style="display: flex; justify-content: space-between; align-items: start;"><h3>' + e.title + '</h3><span class="badge badge-green">' + (e.status === 'active' ? 'Aktivan' : 'Neaktivan') + '</span></div>';
                html += '<p style="color: #666; font-size: 14px; line-height: 1.5; margin: 10px 0;">' + e.description.substring(0, 150) + '...</p>';
                html += '<div class="event-meta"><span>' + e.date + '</span><span>' + e.location + '</span><span>Rezervacije: ' + res.length + '/' + e.capacity + '</span></div>';
                html += '<div style="display: flex; gap: 10px; margin-top: 12px;">';
                html += '<button class="btn btn-primary" style="flex: 1;" onclick="editEvent(' + e.id + ')">Izmijeni</button>';
                html += '<button class="btn btn-danger" style="flex: 1;" onclick="deleteEvent(' + e.id + ')">Obriši</button>';
                html += '</div></div>';
            }
            container.innerHTML = html;
        }

        function loadAdminData() {
            loadAdminEvents();
            loadAdminUsers();
        }

        function loadAdminEvents() {
            var container = document.getElementById('adminEventsList');
            
            if (events.length === 0) {
                container.innerHTML = '<div class="event-card">Nema događaja u sistemu</div>';
                return;
            }

            var html = '';
            for (var i = 0; i < events.length; i++) {
                var e = events[i];
                var res = reservations.filter(function(r) { return r.eventId === e.id; });
                var org = users.find(function(u) { return u.id === e.organizerId; });
                
                html += '<div class="event-card">';
                html += '<div style="display: flex; justify-content: space-between; align-items: start;"><h3>' + e.title + '</h3><span class="badge badge-green">' + (e.status === 'active' ? 'Aktivan' : 'Neaktivan') + '</span></div>';
                html += '<p style="color: #666; font-size: 14px; margin: 10px 0;">' + e.description.substring(0, 100) + '...</p>';
                html += '<div class="event-meta"><span>' + e.date + '</span><span>' + e.city + '</span><span>Rezervacije: ' + res.length + '/' + e.capacity + '</span></div>';
                html += '<p style="color: #666; font-size: 12px; margin: 10px 0;">Organizator: <strong>' + (org ? org.name : 'N/A') + '</strong></p>';
                html += '<div style="display: flex; gap: 10px; margin-top: 12px;">';
                html += '<button class="btn btn-secondary" style="flex: 1;" onclick="toggleEventStatus(' + e.id + ')">' + (e.status === 'active' ? 'Deaktiviraj' : 'Aktiviraj') + '</button>';
                html += '<button class="btn btn-primary" style="flex: 1;" onclick="editEvent(' + e.id + ')">Izmijeni</button>';
                html += '<button class="btn btn-danger" style="flex: 1;" onclick="deleteEvent(' + e.id + ')">Obriši</button>';
                html += '</div></div>';
            }
            container.innerHTML = html;
        }

        function loadAdminUsers() {
            var container = document.getElementById('adminUsersList');
            
            var html = '';
            for (var i = 0; i < users.length; i++) {
                var u = users[i];
                var res = reservations.filter(function(r) { return r.userId === u.id; });
                var evts = events.filter(function(e) { return e.organizerId === u.id; });
                
                html += '<div class="event-card">';
                html += '<div style="display: flex; justify-content: space-between; align-items: start;"><div><h3>' + u.name + '</h3><p style="color: #666; font-size: 13px;">' + u.email + '</p></div>';
                
                var badgeClass = u.role === 'administrator' ? 'badge-purple' : (u.role === 'organizator' ? 'badge-green' : 'badge-orange');
                var roleText = u.role === 'administrator' ? 'Admin' : (u.role === 'organizator' ? 'Organizator' : 'Korisnik');
                html += '<span class="badge ' + badgeClass + '">' + roleText + '</span></div>';
                
                html += '<div style="font-size: 13px; color: #666; margin: 10px 0;">';
                if (u.role === 'organizator') html += '<p>Događaji: ' + evts.length + '</p>';
                if (u.role === 'korisnik') html += '<p>Rezervacije: ' + res.length + '</p>';
                html += '</div>';
                
                if (u.id !== currentUser.id) {
                    html += '<button class="btn btn-danger" style="width: 100%;" onclick="deleteUser(' + u.id + ')">Obriši korisnika</button>';
                } else {
                    html += '<p style="color: #666; font-size: 12px; text-align: center; padding: 10px; background: #f9fafb; border-radius: 6px;">Vaš nalog</p>';
                }
                html += '</div>';
            }
            container.innerHTML = html;
        }

        function openEventFormModal() {
            editingEventId = null;
            document.getElementById('eventFormTitle').textContent = 'Novi događaj';
            clearEventForm();
            document.getElementById('eventFormModal').classList.add('active');
        }

        function closeEventFormModal() {
            document.getElementById('eventFormModal').classList.remove('active');
            editingEventId = null;
        }

        function clearEventForm() {
            document.getElementById('eventTitle').value = '';
            document.getElementById('eventDescription').value = '';
            document.getElementById('eventDate').value = '';
            document.getElementById('eventTime').value = '';
            document.getElementById('eventLocation').value = '';
            document.getElementById('eventCity').value = '';
            document.getElementById('eventCapacity').value = '';
            document.getElementById('eventPrice').value = '';
            document.getElementById('eventType').value = '';
            document.getElementById('eventCategory').value = '';
        }

        function editEvent(eventId) {
            editingEventId = eventId;
            var e = events.find(function(ev) { return ev.id === eventId; });
            
            document.getElementById('eventFormTitle').textContent = 'Izmijeni događaj';
            document.getElementById('eventTitle').value = e.title;
            document.getElementById('eventDescription').value = e.description;
            document.getElementById('eventDate').value = e.date;
            document.getElementById('eventTime').value = e.time;
            document.getElementById('eventLocation').value = e.location;
            document.getElementById('eventCity').value = e.city || '';
            document.getElementById('eventCapacity').value = e.capacity;
            document.getElementById('eventPrice').value = e.price;
            document.getElementById('eventType').value = e.eventType || '';
            document.getElementById('eventCategory').value = e.category || '';
            document.getElementById('eventFormModal').classList.add('active');
        }

        function doSaveEvent() {
            var title = document.getElementById('eventTitle').value;
            var desc = document.getElementById('eventDescription').value;
            var date = document.getElementById('eventDate').value;
            var time = document.getElementById('eventTime').value;
            var loc = document.getElementById('eventLocation').value;
            var city = document.getElementById('eventCity').value;
            var cap = parseInt(document.getElementById('eventCapacity').value);
            var price = parseFloat(document.getElementById('eventPrice').value) || 0;
            var type = document.getElementById('eventType').value;
            var cat = document.getElementById('eventCategory').value;
            
            if (!title || !desc || !date || !time || !loc || !city || !cap) {
                alert('Molimo popunite sva obavezna polja');
                return;
            }

            if (editingEventId) {
                for (var i = 0; i < events.length; i++) {
                    if (events[i].id === editingEventId) {
                        events[i].title = title;
                        events[i].description = desc;
                        events[i].date = date;
                        events[i].time = time;
                        events[i].location = loc;
                        events[i].city = city;
                        events[i].capacity = cap;
                        events[i].price = price;
                        events[i].eventType = type;
                        events[i].category = cat;
                        break;
                    }
                }
                var alertId = currentUser.role === 'administrator' ? 'adminAlertContainer' : 'organizerAlertContainer';
                showAlert(alertId, 'Događaj uspješno ažuriran!', 'success');
            } else {
                events.push({
                    id: events.length + 1,
                    title: title,
                    description: desc,
                    date: date,
                    time: time,
                    location: loc,
                    city: city,
                    capacity: cap,
                    price: price,
                    eventType: type,
                    category: cat,
                    organizerId: currentUser.id,
                    status: 'active'
                });
                var alertId = currentUser.role === 'administrator' ? 'adminAlertContainer' : 'organizerAlertContainer';
                showAlert(alertId, 'Događaj uspješno kreiran!', 'success');
            }
            
            closeEventFormModal();
            if (currentUser.role === 'administrator') loadAdminEvents();
            else loadOrganizerEvents();
        }

        function deleteEvent(eventId) {
            if (!confirm('Da li ste sigurni da želite obrisati ovaj događaj?')) return;
            
            events = events.filter(function(e) { return e.id !== eventId; });
            reservations = reservations.filter(function(r) { return r.eventId !== eventId; });
            
            var alertId = currentUser.role === 'administrator' ? 'adminAlertContainer' : 'organizerAlertContainer';
            showAlert(alertId, 'Događaj uspješno obrisan!', 'success');
            
            if (currentUser.role === 'administrator') loadAdminEvents();
            else loadOrganizerEvents();
        }

        function toggleEventStatus(eventId) {
            for (var i = 0; i < events.length; i++) {
                if (events[i].id === eventId) {
                    events[i].status = events[i].status === 'active' ? 'inactive' : 'active';
                    break;
                }
            }
            showAlert('adminAlertContainer', 'Status događaja promijenjen!', 'success');
            loadAdminEvents();
        }

        function deleteUser(userId) {
            if (!confirm('Da li ste sigurni da želite obrisati ovog korisnika?')) return;
            
            users = users.filter(function(u) { return u.id !== userId; });
            reservations = reservations.filter(function(r) { return r.userId !== userId; });
            events = events.filter(function(e) { return e.organizerId !== userId; });
            
            showAlert('adminAlertContainer', 'Korisnik uspješno obrisan!', 'success');
            loadAdminUsers();
            loadAdminEvents();
        }

        function doRegister() {
            var name = document.getElementById('registerName').value;
            var email = document.getElementById('registerEmail').value;
            var password = document.getElementById('registerPassword').value;
            var confirm = document.getElementById('registerConfirmPassword').value;

            if (!name || name.length < 3) {
                showAlert('registerAlertContainer', 'Ime mora imati najmanje 3 karaktera', 'error');
                return;
            }
            if (!email || !email.includes('@')) {
                showAlert('registerAlertContainer', 'Nevažeća email adresa', 'error');
                return;
            }
            if (users.find(function(u) { return u.email === email; })) {
                showAlert('registerAlertContainer', 'Email adresa je već registrovana', 'error');
                return;
            }
            if (!password || password.length < 6) {
                showAlert('registerAlertContainer', 'Lozinka mora imati najmanje 6 karaktera', 'error');
                return;
            }
            if (password !== confirm) {
                showAlert('registerAlertContainer', 'Lozinke se ne poklapaju', 'error');
                return;
            }

            users.push({ id: users.length + 1, email: email, password: password, role: 'korisnik', name: name });
            showAlert('registerAlertContainer', 'Registracija uspješna! Možete se prijaviti.', 'success');
            setTimeout(showLogin, 2000);
        }

        function doLogout() {
            currentUser = null;
            
            // Sakrij sve view-ove
            document.getElementById('userView').classList.add('hidden');
            document.getElementById('organizerView').classList.add('hidden');
            document.getElementById('adminView').classList.add('hidden');
            
            // Zatvori sve otvorene modale
            document.getElementById('reservationModal').classList.remove('active');
            document.getElementById('reservationsModal').classList.remove('active');
            document.getElementById('marketplaceModal').classList.remove('active');
            document.getElementById('myTicketsModal').classList.remove('active');
            document.getElementById('customTicketModal').classList.remove('active');
            document.getElementById('eventFormModal').classList.remove('active');
            
            // Očisti forme
            document.getElementById('loginEmail').value = '';
            document.getElementById('loginPassword').value = '';
            
            // Prikaži login view
            document.getElementById('loginView').classList.remove('hidden');
            document.getElementById('registerView').classList.add('hidden');
        }

        function doResetFilters() {
            document.getElementById('searchInput').value = '';
            document.getElementById('filterCity').value = '';
            document.getElementById('filterEventType').value = '';
            document.getElementById('filterCategory').value = '';
            loadEvents();
        }

        function loadEvents() {
            var search = document.getElementById('searchInput').value.toLowerCase();
            var city = document.getElementById('filterCity').value;
            var type = document.getElementById('filterEventType').value;
            var cat = document.getElementById('filterCategory').value;
            
            var filtered = events.filter(function(e) {
                return e.status === 'active' && 
                    (!search || e.title.toLowerCase().includes(search) || e.description.toLowerCase().includes(search)) &&
                    (!city || e.city === city) && 
                    (!type || e.eventType === type) && 
                    (!cat || e.category === cat);
            });

            var container = document.getElementById('eventsList');
            if (filtered.length === 0) {
                container.innerHTML = '<div class="event-card">Nema dostupnih događaja</div>';
                return;
            }

            var html = '';
            for (var i = 0; i < filtered.length; i++) {
                var e = filtered[i];
                var res = reservations.filter(function(r) { return r.eventId === e.id; });
                var avail = e.capacity - res.length;
                
                html += '<div class="event-card">';
                html += '<div style="display: flex; justify-content: space-between; align-items: start;"><h3>' + e.title + '</h3><span class="badge badge-purple">' + e.eventType + '</span></div>';
                html += '<p style="color: #666; margin: 10px 0; line-height: 1.6; font-size: 14px;">' + e.description + '</p>';
                html += '<div class="event-meta"><span>' + e.date + '</span><span>' + e.time + '</span><span>' + e.city + '</span><span>' + avail + '/' + e.capacity + '</span><span><strong>' + e.price + ' EUR</strong></span></div>';
                html += '<button class="btn btn-primary" style="width: 100%; margin-top: 10px;" onclick="openReservModal(' + e.id + ')" ' + (avail === 0 ? 'disabled' : '') + '>' + (avail === 0 ? 'Popunjeno' : 'Rezerviši') + '</button>';
                html += '</div>';
            }
            container.innerHTML = html;
        }

        function openReservModal(eventId) {
            reservingEventId = eventId;
            var e = events.find(function(ev) { return ev.id === eventId; });
            var res = reservations.filter(function(r) { return r.eventId === eventId; });
            var avail = e.capacity - res.length;
            
            currentEventPrice = e.price;
            
            var html = '<h3 style="color: #667eea; font-size: 17px;">' + e.title + '</h3>';
            html += '<p style="color: #666; margin: 10px 0; line-height: 1.6; font-size: 14px;">' + e.description + '</p>';
            html += '<div style="margin: 15px 0; font-size: 14px;">';
            html += '<p style="margin: 5px 0;"><strong>Datum i vrijeme:</strong> ' + e.date + ' u ' + e.time + '</p>';
            html += '<p style="margin: 5px 0;"><strong>Lokacija:</strong> ' + e.location + ', ' + e.city + '</p>';
            html += '<p style="margin: 5px 0;"><strong>Dostupnost:</strong> ' + avail + ' od ' + e.capacity + ' mjesta</p>';
            html += '<p style="margin: 5px 0;"><strong>Cijena po karti:</strong> ' + e.price + ' EUR</p>';
            html += '</div>';
            
            document.getElementById('modalEventDetails').innerHTML = html;
            document.getElementById('ticketQuantity').value = 1;
            document.getElementById('ticketQuantity').max = Math.min(avail, 10);
            updatePrice();
            document.getElementById('reservationModal').classList.add('active');
        }

        function closeReservModal() {
            document.getElementById('reservationModal').classList.remove('active');
            reservingEventId = null;
        }

        function updatePrice() {
            var quantity = parseInt(document.getElementById('ticketQuantity').value) || 1;
            var totalPrice = currentEventPrice * quantity;
            document.getElementById('totalPriceDisplay').textContent = 'Ukupna cijena: ' + totalPrice.toFixed(2) + ' EUR';
        }

        function doConfirmReservation() {
            var e = events.find(function(ev) { return ev.id === reservingEventId; });
            var res = reservations.filter(function(r) { return r.eventId === reservingEventId; });
            var quantity = parseInt(document.getElementById('ticketQuantity').value) || 1;
            
            if (res.length >= e.capacity) {
                showAlert('userAlertContainer', 'Nema više slobodnih mjesta', 'error');
                closeReservModal();
                return;
            }
            
            if (res.length + quantity > e.capacity) {
                showAlert('userAlertContainer', 'Nema dovoljno mjesta za traženi broj karata', 'error');
                return;
            }
            
            var totalPrice = e.price * quantity;
            
            reservations.push({
                id: reservations.length + 1,
                eventId: reservingEventId,
                userId: currentUser.id,
                userName: currentUser.name,
                reservationDate: new Date().toISOString().split('T')[0],
                status: 'confirmed',
                price: totalPrice,
                quantity: quantity
            });
            
            showAlert('userAlertContainer', 'Rezervacija uspješna! Broj karata: ' + quantity + ', Ukupan iznos: ' + totalPrice.toFixed(2) + ' EUR', 'success');
            closeReservModal();
            loadEvents();
        }

        function openReservationsModal() {
            loadReservations();
            document.getElementById('reservationsModal').classList.add('active');
        }

        function closeReservationsModal() {
            document.getElementById('reservationsModal').classList.remove('active');
        }

        function loadReservations() {
            var userRes = reservations.filter(function(r) { return r.userId === currentUser.id; });
            var container = document.getElementById('reservationsModalList');
            
            if (userRes.length === 0) {
                container.innerHTML = '<p style="color: #667eea; padding: 20px; text-align: center; font-size: 14px; font-weight: 600; background: #ede9fe; border-radius: 8px;">Nemate rezervacija</p>';
                return;
            }

            var html = '';
            for (var i = 0; i < userRes.length; i++) {
                var r = userRes[i];
                var e = events.find(function(ev) { return ev.id === r.eventId; });
                if (!e) continue;
                
                var onResell = resellListings.some(function(rl) { return rl.reservationId === r.id; });
                
                html += '<div class="event-card">';
                html += '<h3>' + e.title + '</h3>';
                html += '<div class="event-meta"><span>' + e.date + '</span><span>' + e.city + '</span></div>';
                html += '<p style="color: #666; margin: 10px 0; font-size: 14px;">Broj karata: <strong>' + (r.quantity || 1) + '</strong></p>';
                html += '<p style="color: #666; margin: 10px 0; font-size: 14px;">Plaćeno: <strong>' + r.price + ' EUR</strong></p>';
                
                if (onResell) {
                    html += '<div class="badge badge-orange" style="display: block; text-align: center; margin: 10px 0;">Na preprodaji</div>';
                } else {
                    html += '<div style="display: flex; gap: 10px; margin-top: 10px;">';
                    html += '<button class="btn btn-danger" style="flex: 1;" onclick="doCancelReservation(' + r.id + ')">Otkaži</button>';
                    html += '</div>';
                }
                html += '</div>';
            }
            container.innerHTML = html;
        }

        function doCancelReservation(resId) {
            if (!confirm('Da li ste sigurni da želite otkazati rezervaciju?')) return;
            
            resellListings = resellListings.filter(function(l) { return l.reservationId !== resId; });
            reservations = reservations.filter(function(r) { return r.id !== resId; });
            
            showAlert('userAlertContainer', 'Rezervacija otkazana! Mjesto je ponovo dostupno.', 'success');
            loadEvents();
            loadReservations();
            
            if (document.getElementById('marketplaceModal').classList.contains('active')) {
                loadMarketplace();
            }
        }

        function openMarketplace() {
            loadMarketplace();
            document.getElementById('marketplaceModal').classList.add('active');
        }

        function closeMarketplaceModal() {
            document.getElementById('marketplaceModal').classList.remove('active');
        }

        function loadMarketplace() {
            var myListings = resellListings.filter(function(l) {
                if (l.isCustom) {
                    var ticket = customTickets.find(function(t) { return t.id === l.customTicketId; });
                    return ticket && ticket.ownerId === currentUser.id;
                } else {
                    var r = reservations.find(function(res) { return res.id === l.reservationId; });
                    return r && r.userId === currentUser.id;
                }
            });

            var otherListings = resellListings.filter(function(l) {
                if (l.isCustom) {
                    var ticket = customTickets.find(function(t) { return t.id === l.customTicketId; });
                    return ticket && ticket.ownerId !== currentUser.id;
                } else {
                    var r = reservations.find(function(res) { return res.id === l.reservationId; });
                    return r && r.userId !== currentUser.id;
                }
            });

            var myHtml = '';
            if (myListings.length === 0) {
                myHtml = '<p style="color: #667eea; padding: 20px; text-align: center; font-size: 14px; font-weight: 600; background: #ede9fe; border-radius: 8px;">Nemate karata na preprodaji</p>';
            } else {
                for (var i = 0; i < myListings.length; i++) {
                    var l = myListings[i];
                    
                    if (l.isCustom) {
                        var ticket = customTickets.find(function(t) { return t.id === l.customTicketId; });
                        if (!ticket) continue;
                        
                        myHtml += '<div class="event-card" style="margin-bottom: 12px;">';
                        myHtml += '<h3>' + ticket.title + '</h3>';
                        myHtml += '<p style="color: #666; font-size: 13px; margin: 8px 0;">' + ticket.description.substring(0, 80) + '...</p>';
                        myHtml += '<div class="event-meta"><span>' + ticket.date + '</span><span>' + ticket.city + '</span></div>';
                        myHtml += '<p style="color: #667eea; font-weight: 600; margin: 8px 0;">Cijena: ' + l.price + ' EUR</p>';
                        myHtml += '<div class="share-buttons">';
                        myHtml += '<button class="share-btn share-btn-facebook" onclick="shareTicket(\'facebook\', ' + l.id + ')">📘 Facebook</button>';
                        myHtml += '<button class="share-btn share-btn-twitter" onclick="shareTicket(\'twitter\', ' + l.id + ')">🐦 Twitter</button>';
                        myHtml += '<button class="share-btn share-btn-whatsapp" onclick="shareTicket(\'whatsapp\', ' + l.id + ')">💬 WhatsApp</button>';
                        myHtml += '</div>';
                        myHtml += '<button class="btn btn-danger" style="width: 100%; margin-top: 8px;" onclick="doRemoveListing(' + l.id + ')">Ukloni</button>';
                        myHtml += '</div>';
                    } else {
                        var r = reservations.find(function(res) { return res.id === l.reservationId; });
                        if (!r) continue;
                        var e = events.find(function(ev) { return ev.id === r.eventId; });
                        if (!e) continue;
                        
                        myHtml += '<div class="event-card" style="margin-bottom: 12px;">';
                        myHtml += '<h3>' + e.title + '</h3>';
                        myHtml += '<p style="color: #666; font-size: 13px; margin: 8px 0;">' + e.description.substring(0, 80) + '...</p>';
                        myHtml += '<div class="event-meta"><span>' + e.date + '</span><span>' + e.city + '</span></div>';
                        myHtml += '<p style="color: #667eea; font-weight: 600; margin: 8px 0;">Cijena: ' + l.price + ' EUR</p>';
                        myHtml += '<div class="share-buttons">';
                        myHtml += '<button class="share-btn share-btn-facebook" onclick="shareTicket(\'facebook\', ' + l.id + ')">📘 Facebook</button>';
                        myHtml += '<button class="share-btn share-btn-twitter" onclick="shareTicket(\'twitter\', ' + l.id + ')">🐦 Twitter</button>';
                        myHtml += '<button class="share-btn share-btn-whatsapp" onclick="shareTicket(\'whatsapp\', ' + l.id + ')">💬 WhatsApp</button>';
                        myHtml += '</div>';
                        myHtml += '<button class="btn btn-danger" style="width: 100%; margin-top: 8px;" onclick="doRemoveListing(' + l.id + ')">Ukloni</button>';
                        myHtml += '</div>';
                    }
                }
            }

            var otherHtml = '';
            if (otherListings.length === 0) {
                otherHtml = '<p style="color: #667eea; padding: 20px; text-align: center; font-size: 14px; font-weight: 600; background: #ede9fe; border-radius: 8px;">Nema dostupnih karata za kupovinu</p>';
            } else {
                for (var j = 0; j < otherListings.length; j++) {
                    var listing = otherListings[j];
                    
                    if (listing.isCustom) {
                        var customTicket = customTickets.find(function(t) { return t.id === listing.customTicketId; });
                        if (!customTicket) continue;
                        var seller = users.find(function(u) { return u.id === customTicket.ownerId; });
                        
                        otherHtml += '<div class="event-card resell-card" style="margin-bottom: 12px;">';
                        otherHtml += '<h3>' + customTicket.title + '</h3>';
                        otherHtml += '<p style="color: #666; font-size: 13px; margin: 8px 0;">' + customTicket.description.substring(0, 100) + '...</p>';
                        otherHtml += '<div class="event-meta"><span>' + customTicket.date + '</span><span>' + customTicket.time + '</span><span>' + customTicket.city + '</span></div>';
                        otherHtml += '<p style="color: #666; font-size: 12px; margin: 8px 0;">Prodaje: <strong>' + (seller ? seller.name : 'N/A') + '</strong></p>';
                        otherHtml += '<div class="price-box"><p class="label">Cijena</p><p class="price">' + listing.price + ' EUR</p></div>';
                        otherHtml += '<button class="btn btn-success" style="width: 100%;" onclick="doBuyTicket(' + listing.id + ', false)">Kupi</button>';
                        otherHtml += '</div>';
                    } else {
                        var res = reservations.find(function(res) { return res.id === listing.reservationId; });
                        if (!res) continue;
                        var evt = events.find(function(ev) { return ev.id === res.eventId; });
                        if (!evt) continue;
                        var seller2 = users.find(function(u) { return u.id === res.userId; });
                        
                        otherHtml += '<div class="event-card resell-card" style="margin-bottom: 12px;">';
                        otherHtml += '<h3>' + evt.title + '</h3>';
                        otherHtml += '<p style="color: #666; font-size: 13px; margin: 8px 0;">' + evt.description.substring(0, 100) + '...</p>';
                        otherHtml += '<div class="event-meta"><span>' + evt.date + '</span><span>' + evt.time + '</span><span>' + evt.city + '</span></div>';
                        otherHtml += '<p style="color: #666; font-size: 12px; margin: 8px 0;">Događaj: <strong>' + evt.title + '</strong></p>';
                        otherHtml += '<p style="color: #666; font-size: 12px; margin: 8px 0;">Prodaje: <strong>' + (seller2 ? seller2.name : 'N/A') + '</strong></p>';
                        otherHtml += '<div class="price-box"><p class="label">Cijena</p><p class="price">' + listing.price + ' EUR</p>';
                        if (listing.price < res.price) {
                            otherHtml += '<p style="font-size: 13px; margin-top: 5px; opacity: 0.9;">Ušteda: ' + (res.price - listing.price).toFixed(2) + ' EUR</p>';
                        }
                        otherHtml += '</div>';
                        otherHtml += '<button class="btn btn-success" style="width: 100%;" onclick="doBuyTicket(' + listing.id + ', true)">Kupi</button>';
                        otherHtml += '</div>';
                    }
                }
            }

            document.getElementById('myMarketplaceListings').innerHTML = myHtml;
            document.getElementById('availableMarketplaceListings').innerHTML = otherHtml;
        }

        function doBuyTicket(listingId, isRegular) {
            var listing = resellListings.find(function(l) { return l.id === listingId; });
            if (!listing) return;
            
            var eventTitle = '';
            var eventId = null;
            
            if (isRegular) {
                var res = reservations.find(function(r) { return r.id === listing.reservationId; });
                if (!res) return;
                var evt = events.find(function(e) { return e.id === res.eventId; });
                if (!evt) return;
                eventTitle = evt.title;
                eventId = evt.id;
            } else {
                var ticket = customTickets.find(function(t) { return t.id === listing.customTicketId; });
                if (!ticket) return;
                eventTitle = ticket.title;
            }
            
            if (!confirm('Kupiti kartu za "' + eventTitle + '" po cijeni ' + listing.price + ' EUR?')) return;
            
            if (isRegular) {
                reservations.push({
                    id: reservations.length + 1,
                    eventId: eventId,
                    userId: currentUser.id,
                    userName: currentUser.name,
                    reservationDate: new Date().toISOString().split('T')[0],
                    status: 'confirmed',
                    price: listing.price,
                    quantity: 1
                });
            }
            
            resellListings = resellListings.filter(function(l) { return l.id !== listingId; });
            
            showAlert('userAlertContainer', 'Karta uspješno kupljena za ' + listing.price + ' EUR!', 'success');
            loadMarketplace();
            if (document.getElementById('reservationsModal').classList.contains('active')) {
                loadReservations();
            }
        }

        function doRemoveListing(listingId) {
            if (!confirm('Ukloniti kartu sa preprodaje?')) return;
            
            resellListings = resellListings.filter(function(l) { return l.id !== listingId; });
            showAlert('userAlertContainer', 'Karta uklonjena sa preprodaje', 'success');
            loadMarketplace();
            if (document.getElementById('reservationsModal').classList.contains('active')) {
                loadReservations();
            }
        }

        function openMyTickets() {
            var userRes = reservations.filter(function(r) { 
                return r.userId === currentUser.id && !resellListings.some(function(rl) { return rl.reservationId === r.id; });
            });
            
            if (userRes.length === 0) {
                showAlert('userAlertContainer', 'Nemate dostupnih karata za preprodaju', 'error');
                return;
            }

            var html = '';
            for (var i = 0; i < userRes.length; i++) {
                var r = userRes[i];
                var e = events.find(function(ev) { return ev.id === r.eventId; });
                if (!e) continue;
                
                html += '<div class="event-card">';
                html += '<h3>' + e.title + '</h3>';
                html += '<div class="event-meta"><span>' + e.date + '</span><span>' + e.city + '</span></div>';
                html += '<p style="color: #666; margin: 10px 0; font-size: 14px;">Originalna cijena: <strong>' + r.price + ' EUR</strong></p>';
                html += '<button class="btn btn-success" style="width: 100%;" onclick="doListForResell(' + r.id + ', ' + r.price + ')">Stavi na preprodaju</button>';
                html += '</div>';
            }
            
            document.getElementById('myTicketsList').innerHTML = html;
            document.getElementById('myTicketsModal').classList.add('active');
        }

        function closeMyTicketsModal() {
            document.getElementById('myTicketsModal').classList.remove('active');
        }

        function doListForResell(resId, originalPrice) {
            var price = prompt('Unesite cijenu za preprodaju (EUR):', originalPrice);
            if (price === null || price === '') return;
            
            var p = parseFloat(price);
            if (isNaN(p) || p <= 0) {
                alert('Nevažeća cijena!');
                return;
            }
            
            resellListings.push({
                id: resellListings.length + 1,
                reservationId: resId,
                price: p,
                listedDate: new Date().toISOString().split('T')[0]
            });
            
            closeMyTicketsModal();
            showAlert('userAlertContainer', 'Karta uspješno stavljena na preprodaju!', 'success');
            
            if (document.getElementById('marketplaceModal').classList.contains('active')) {
                loadMarketplace();
            }
            if (document.getElementById('reservationsModal').classList.contains('active')) {
                loadReservations();
            }
        }

        function openAddCustom() {
            // Popuni dropdown sa svim događajima
            var select = document.getElementById('customTicketEvent');
            var html = '<option value="">-- Izaberi događaj --</option>';
            
            for (var i = 0; i < events.length; i++) {
                var e = events[i];
                if (e.status === 'active') {
                    html += '<option value="' + e.id + '">' + e.title + ' - ' + e.date + ' (' + e.city + ')</option>';
                }
            }
            
            select.innerHTML = html;
            document.getElementById('customTicketModal').classList.add('active');
        }

        function closeCustomModal() {
            document.getElementById('customTicketModal').classList.remove('active');
        }

        function doSaveCustom() {
            var eventId = document.getElementById('customTicketEvent').value;
            var price = parseFloat(document.getElementById('customTicketPrice').value);
            var desc = document.getElementById('customTicketDescription').value;

            if (!eventId) {
                alert('Molimo izaberite događaj');
                return;
            }
            
            if (!price || price <= 0) {
                alert('Molimo unesite validnu cijenu');
                return;
            }

            var selectedEvent = events.find(function(e) { return e.id == eventId; });
            if (!selectedEvent) {
                alert('Događaj nije pronađen');
                return;
            }

            var ticketId = customTickets.length + 1;
            customTickets.push({
                id: ticketId,
                eventId: selectedEvent.id,
                title: selectedEvent.title,
                description: desc || selectedEvent.description,
                date: selectedEvent.date,
                time: selectedEvent.time,
                location: selectedEvent.location,
                city: selectedEvent.city,
                eventType: selectedEvent.eventType,
                ownerId: currentUser.id
            });

            resellListings.push({
                id: resellListings.length + 1,
                isCustom: true,
                customTicketId: ticketId,
                price: price,
                listedDate: new Date().toISOString().split('T')[0]
            });

            showAlert('userAlertContainer', 'Karta za ' + selectedEvent.title + ' uspješno dodana na preprodaju!', 'success');
            closeCustomModal();
            
            document.getElementById('customTicketEvent').value = '';
            document.getElementById('customTicketPrice').value = '';
            document.getElementById('customTicketDescription').value = '';
            
            loadMarketplace();
        }

        function shareTicket(platform, listingId) {
            var listing = resellListings.find(function(l) { return l.id === listingId; });
            if (!listing) return;
            
            var ticketTitle = '';
            var ticketPrice = listing.price;
            var ticketDate = '';
            var ticketCity = '';
            
            if (listing.isCustom) {
                var ticket = customTickets.find(function(t) { return t.id === listing.customTicketId; });
                if (!ticket) return;
                ticketTitle = ticket.title;
                ticketDate = ticket.date;
                ticketCity = ticket.city;
            } else {
                var res = reservations.find(function(r) { return r.id === listing.reservationId; });
                if (!res) return;
                var evt = events.find(function(e) { return e.id === res.eventId; });
                if (!evt) return;
                ticketTitle = evt.title;
                ticketDate = evt.date;
                ticketCity = evt.city;
            }
            
            var message = 'Prodajem kartu za: ' + ticketTitle + '\nDatum: ' + ticketDate + '\nGrad: ' + ticketCity + '\nCijena: ' + ticketPrice + ' EUR\nKontaktirajte me!';
            var url = encodeURIComponent(window.location.href);
            var encodedMessage = encodeURIComponent(message);
            
            var shareUrl = '';
            
            if (platform === 'facebook') {
                shareUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + url + '&quote=' + encodedMessage;
            } else if (platform === 'twitter') {
                shareUrl = 'https://twitter.com/intent/tweet?text=' + encodedMessage + '&url=' + url;
            } else if (platform === 'whatsapp') {
                shareUrl = 'https://wa.me/?text=' + encodedMessage + '%20' + url;
            }
            
            if (shareUrl) {
                window.open(shareUrl, '_blank', 'width=600,height=400');
            }
        }

        document.addEventListener('DOMContentLoaded', function() {
            var searchInput = document.getElementById('searchInput');
            var filterCity = document.getElementById('filterCity');
            var filterEventType = document.getElementById('filterEventType');
            var filterCategory = document.getElementById('filterCategory');
            
            if (searchInput) {
                searchInput.addEventListener('input', function() {
                    if (currentUser) loadEvents();
                });
            }
            
            if (filterCity) {
                filterCity.addEventListener('change', function() {
                    if (currentUser) loadEvents();
                });
            }
            
            if (filterEventType) {
                filterEventType.addEventListener('change', function() {
                    if (currentUser) loadEvents();
                });
            }
            
            if (filterCategory) {
                filterCategory.addEventListener('change', function() {
                    if (currentUser) loadEvents();
                });
            }
        });

        showLogin();