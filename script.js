const form = document.getElementById('form');
const search = document.getElementById('search');
const result = document.getElementById('result');
const more = document.getElementById('more');

const apiURL = "https://api.lyrics.ovh/";

form.addEventListener('submit', e => {
    e.preventDefault();  // เมื่อทำการกด search แล้วจะไม่กระพริบหน้าจอ หรือ รีจอใหม่
    const songtxt = search.value.trim();
    
    if(!songtxt){
        alert("ป้อนข้อมูลไม่ถูกต้อง");
    }else{
        searchLyrics(songtxt);
    }
});

async function searchLyrics(song){
    const res = await fetch(`${apiURL}/suggest/${song}`);    // ส่ง request ไปยัง api
    const allSongs = await res.json();
    showData(allSongs);
}

function showData(songs){
    result.innerHTML = `
        <ul class="songs">
            ${songs.data.map(song => 
                `<li>
                    <span>
                        <strong>${song.artist.name}</strong> - ${song.title}
                    </span>
                    <button class="btn"
                        data-artist="${song.artist.name}"
                        data-song="${song.title}"
                    >เนื้อเพลง</button>
                </li>`
            ).join("")}
        </ul>
    `;
    // กดปุ่ม next เพื่อดึงเอาเพลงที่ 16 ขึ้นไปมาแสดงผล
    if(songs.next || songs.prev){
        more.innerHTML = `
            ${songs.prev ? `<button class="btn" onclick="getMoreSongs('${songs.prev}')">Prev</button>` : ''}
            ${songs.next ? `<button class="btn" onclick="getMoreSongs('${songs.next}')">Next</button>` : ''}
        `
    }else{
        more.innerHTML = "";
    }
}

async function getMoreSongs(songsUrl){
    const res = await fetch(`https://cors-anywhere.herokuapp.com/${songsUrl}`);    
    const allSongs = await res.json();
    showData(allSongs);
}

result.addEventListener('click', e =>{
    const clickEL = e.target;
    if(clickEL.tagName == "BUTTON"){
        const artist = clickEL.getAttribute('data-artist');
        const songName = clickEL.getAttribute('data-song');

        getLyrics(artist,songName);
    }
});

async function getLyrics(artist,songName){
    const res = await fetch(`${apiURL}/v1/${artist}/${songName}`);    
    const data = await res.json();
    const lyrics = data.lyrics; //.replace(/(\r\n|\r|\n)/g, "<br>");  // จัดวางเนื้อเพลงให้มี space มากขึ้น
    console.log(data);
    
    if(lyrics){
        result.innerHTML = 
        `<h2><span>
            <strong>${artist}</strong> - ${songName}
        </span></h2>
        <span>${lyrics}</span>`;
        
    }else{
        result.innerHTML = 
        `<h2><span>
            <strong>${artist}</strong> - ${songName}
        </span></h2>
        <span>ไม่พบเนื้อเพลง</span>`;
    }
    more.innerHTML = '';  // เอาปุ่ม next ในหน้าเนื้อเพลงออก
}