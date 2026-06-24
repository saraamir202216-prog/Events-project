let allEvents = [];

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const res = await fetch("http://localhost:5000/api/events");
        allEvents = await res.json();

        displayEvents(allEvents);
    } catch (err) {
        console.error(err);
    }
});

function displayEvents(events) {

    const container = document.getElementById("eventsContainer");

    if (!container) return;

    container.innerHTML = "";

    events.forEach(event => {

        container.innerHTML += `
        <div class="col-md-4 mb-4">
            <div class="card">
                <div class="card-body">

                    <h4>${event.title}</h4>

                    <p>Date: ${new Date(event.date).toDateString()}</p>

                    <p>Venue: ${event.venue}</p>

                    <a href="events-detail.html?id=${event._id}" class="btn btn-success">
                        View Details
                    </a>

                </div>
            </div>
        </div>
        `;
    });
}

function sortEvents() {

    console.log(allEvents);

    const sorted = [...allEvents];

    sorted.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    });

    displayEvents(sorted);
}