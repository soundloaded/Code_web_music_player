const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'VIK_PLAYER';
const DURATION_STORAGE_KEY = 'VIK_DURATION';




const audio = $('#audio');
const author = $('.player__song-author');
const albumLists = Array.from($$('.album--container'));
const albumScrollBtns = $$('.container__move-btn.move-btn--album');
const artistLists = Array.from($$('.artist--container'));
const artistScrollBtns = $$('.container__move-btn.move-btn--artist');
const cdThumb = $('.player__song-thumb');
const containerTabs = $$('.container__tab');
const durationTime = $('#durationtime');
const homeMVs = $$('.tab-home.mv--container .row__item.item-mv--height');
const player = $('.player');
const playAllBtns = $$('.btn--play-all');
const playlistLists = Array.from($$('.playlist--container'));
const playlistScrollBtns = $$('.container__move-btn.move-btn--playlist');
const playBtns = Array.from($$('.btn-toggle-play'));
const prevBtn = $('.btn-prev');
const progress = $('#progress');
const progressBlock = $('.progress-block');
const mvLists = Array.from($$('.mv--container'));
const mvScrollBtns = $$('.container__move-btn.move-btn--mv');
const navbarItems = Array.from($$('.content__navbar-item'));
const nextBtn = $('.btn-next');
const optionBtn = $('.option');
const slideImgs = $$('.container__slide-item');
const songLists = Array.from($$('.playlist__list'));
const songTitle = $('.player__song-title');
const repeatBtn = $('.btn-repeat');
const randomBtn = $('.btn-random');
const trackTime = $('#tracktime');
const volume = $('.volume__range');
const volumeBtn = $('.volume .option-icon')

const app = {
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    isSeeking: false,
    scrollToRight: true,
    indexArray: [],
    slideIndexs: [ 1, 1, 1, 1],
    slideSelectors: [
        '.tab-home.playlist--container .row__item.item-playlist--height',
        '.tab-home.album--container .row__item.item-album--height',
        '.tab-home.mv--container .row__item.item-mv--height',
        '.tab-home.artist--container .row__item.item-artist--height',
    ],
    
    songs: JSON.parse(localStorage.getItem(MUSIC_STORAGE_KEY) || '[]'),

    playlists: JSON.parse(localStorage.getItem(PLAYLIST_STORAGE_KEY) || '[]'),

    albums: JSON.parse(localStorage.getItem(ALBUM_STORAGE_KEY) || '[]'),

    mvs: JSON.parse(localStorage.getItem(MV_STORAGE_KEY) || '[]'),

    artists: JSON.parse(localStorage.getItem(ARTIST_STORAGE_KEY) || '[]'),

    durationList: JSON.parse(localStorage.getItem(DURATION_STORAGE_KEY) || '["03:28","04:45","02:38","03:28","03:48","03:32","03:04","03:37","03:31","03:11","03:28","03:21","03:17","02:37"]'),

    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY) || '{}'),


    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },

    

    html([first, ...string], ...values) {
        return values.reduce(
            (acc, cur) => acc.concat(cur, string.shift())
            , [first]
        )
        .filter(x => x && x !== true || x === 0)
        .join('')       
    },
    

    
    render : function() {
        // Render songs
        songLists.forEach((songList, songIndex) => {
            songList.innerHTML = app.html`${app.songs.map(function(song,index) {
                return app.html`
                    <div class="playlist__list-song media ${app.currentIndex === index ? 'active' : ''}" data-index="${index}">
                        <div class="playlist__song-info media__left mr-10">
                            ${songIndex === 1 && app.html`
                            <div class="playlist__song-check">
                                <input type="checkbox" name="" id="playlist__check-${index}" class="mr-10" style="display: none">
                                <label for="playlist__check-${index}"></label>
                            </div>
                            <i class="bi bi-music-note-beamed mr-10"></i>
                            `}
                            <div class="playlist__song-thumb media__thumb mr-10" style="background: url('${song.image}') no-repeat center center / cover"></div>
                            <div class="playlist__song-body media__info">
                                <span class="playlist__song-title info__title">${song.name}</span>
                                <p class="playlist__song-author info__author">
                                    ${song.singer.map((singer,index) => {
                                        return app.html`
                                        <a href="#" class="is-ghost">${singer}</a>${index < song.singer.length - 1 && ','}
                                        `
                                    })}
                                </p>
                            </div>
                        </div>
                        <span class="playlist__song-time">${app.durationList[index]}</span>
                        <div class="playlist__song-option">
                            <div class="playlist__song-btn">
                                <i class="option-icon bi bi-mic-fill"></i>
                            </div>
                            <div class="playlist__song-btn">
                                <i class="option-icon bi bi-heart-fill primary"></i>
                            </div>
                            <div class="playlist__song-btn">
                                <i class="option-icon bi bi-three-dots"></i>
                            </div>
                        </div>
                    </div>
                `
            })}`
        })

        // Render playlist
        playlistLists.forEach((playlistList, playlistIndex) => {
            playlistList.innerHTML = app.html`
                <div class="col l-2-4 row__item ${playlistIndex === 0 && 'item-playlist--height' || 'item-tab-playlist--height'} ${playlistIndex === 1 && 'mb-30'}">
                    <div class="row__item-container flex--center item-create--properties">
                        <i class="bi bi-plus-lg album__create-icon"></i>
                        <span class="album__create-annotate">Tạo playlist mới</span>
                    </div>
                </div>
                ${app.playlists.map((playlist, index) => {
                    return app.html`
                        <div class="col l-2-4 row__item ${playlistIndex === 0 && 'item-playlist--height' || 'item-tab-playlist--height'} ${playlistIndex === 1 && 'mb-30'}">
                            <div class="row__item-container flex--top-left">
                                <div class="row__item-display br-5">
                                    <div class="row__item-img img--square" style="background: url('${playlist.image}') no-repeat center center / cover"></div>
                                    <div class="row__item-actions">
                                        <button class="action-btn">
                                            <i class="bi bi-x-lg"></i>
                                        </button>
                                        <div class="playlist-play">
                                            <div class="control-btn btn-toggle-play">
                                                <i class="bi bi-play-fill icon-play"></i>
                                            </div>
                                        </div>
                                        <button class="action-btn">
                                            <i class="bi bi-three-dots"></i>
                                        </button>
                                    </div>
                                    <div class="overlay"></div>
                                </div>
                                <div class="row__item-info">
                                    <a href="#" class="row__info-name">${playlist.name}</a>
                                    <h3 class="row__info-creator">${playlist.creator}</h3>
                                </div>
                            </div>
                        </div>
                    `
                })}`
        })

        // Render albums
        albumLists.forEach((albumList, albumIndex) => {
            albumList.innerHTML = app.html`
                ${app.albums.map((album,index) => {
                    return app.html`
                        <div class="col l-2-4 row__item item-album--height ${albumIndex === 1 && 'mb-30'}">
                            <div class="row__item-container flex--top-left">
                                <div class="row__item-display br-5">
                                    <div class="row__item-img img--square" style="background: url('${album.image}') no-repeat center center / cover"></div>
                                    <div class="row__item-actions">
                                        <button class="action-btn">
                                            <i class="bi bi-x-lg"></i>
                                        </button>
                                        <div class="playlist-play">
                                            <div class="control-btn btn-toggle-play">
                                                <i class="bi bi-play-fill icon-play"></i>
                                            </div>
                                        </div>
                                        <button class="action-btn">
                                            <i class="bi bi-three-dots"></i>
                                        </button>
                                    </div>
                                    <div class="overlay"></div>
                                </div>
                                <div class="row__item-info">
                                    <a href="#" class="row__info-name">${album.name}</a>
                                </div>
                            </div>
                        </div>
                    `
                })}
            `
        })
        
        // Render MV
        mvLists.forEach((mvList, mvIndex) => {
            mvList.innerHTML = app.html`
                ${app.mvs.map((mv, index) => {
                    return app.html`
                        <div class="col l-4 row__item item-mv--height ${mvIndex === 1 && 'mb-30'}">
                            <div class="row__item-container flex--top-left">
                                <div class="row__item-display br-5">
                                    <div class="row__item-img img--mv" style="background: url('${mv.image}') no-repeat center center / cover"></div>
                                    <div class="row__item-actions">
                                        <button class="action-btn mv-btn--close">
                                            <i class="bi bi-x-lg"></i>
                                        </button>
                                        <div class="playlist-play">
                                            <div class="control-btn btn-toggle-play">
                                                <i class="bi bi-play-fill icon-play"></i>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="overlay"></div>
                                    <div class="mv__time">${mv.time}</div>
                                </div>
                                <div class="row__item-info media">
                                    <div class="media__left">
                                        <div class="media__thumb is-rounded mr-10" style="background: url('${mv.authorAvatar}') no-repeat center center / cover"></div>
                                        <div class="media__info">
                                            <span class="info__title is-active">${mv.name}</span>
                                            <p class="info__author">
                                                ${mv.author.map((author, index) => {
                                                    return app.html`
                                                        <a href="#" class="is-ghost">${author}</a>${index < mv.author.length -1 && ','}
                                                    `
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `
                })}
            `
        })

        //Render artist
        artistLists.forEach((artistList, artistIndex) => {
            artistList.innerHTML = app.html`
                ${app.artists.map((artist, index) => {
                    return app.html`
                        <div class="col l-2-4 row__item item-artist--height ${artistIndex === 1 && 'mb-30'}">
                            <div class="row__item-container flex--top-left">
                                <div class="row__item-display is-rounded">
                                    <div class="row__item-img img--square" style="background: url('${artist.image}') no-repeat center center / cover"></div>
                                    <div class="row__item-actions">
                                        <button class="action-btn">
                                            <i class="bi bi-x-lg"></i>
                                        </button>
                                        <div class="playlist-play">
                                            <div class="control-btn btn-toggle-play">
                                                <i class="bi bi-play-fill icon-play"></i>
                                            </div>
                                        </div>
                                        <button class="action-btn">
                                            <i class="bi bi-three-dots"></i>
                                        </button>
                                    </div>
                                    <div class="overlay"></div>
                                </div>
                                <div class="row__item-info media artist-info--height">
                                    <div class="media__left">
                                        <div href="#" class="row__info-name is-ghost mt-15 lh-19 text-center">
                                            ${artist.name}
                                            <i class="bi bi-star-fill row__info-icon">
                                                <div class="icon-overlay"></div>
                                            </i>
                                        </div>
                                        <h3 class="row__info-creator text-center">${artist.folowers} quan tâm</h3>
                                    </div>
                                </div>
                                <div class="row__item-btn">
                                    <button class="button is-small button-primary">
                                        <i class="bi bi-check2"></i>
                                        &nbsp;Đã quan tâm
                                    </button>
                                </div>
                            </div>
                        </div>
                    `
                })}
            `
        })

        this.scrollToActiveSong();
    },

    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },



    handleEvents: function() {
        const _this = this;


        // Handle when click play
        playBtns.forEach(playBtn => {
            playBtn.onclick = function() {
                if(_this.isPlaying) {
                    audio.pause();
                } else {
                    audio.play();
                }
            }
        })

        // Handle when click play all
        playAllBtns.forEach(playAllBtn => {
            playAllBtn.onclick = function() {
                _this.currentIndex = 0;
                const songActives = $$(`.playlist__list-song[data-index="${_this.currentIndex}"]`)
                _this.loadCurrentSong();
                Array.from($$('.playlist__list-song.active')).forEach(songActive => {
                    songActive.classList.remove('active');
                })
                Array.from(songActives).forEach(songActive => {
                    songActive.classList.add('active');
                })
                _this.loadCurrentSong();
                audio.play();
            }
        })

        // When the song is played
        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }
        
        // When the song is paused
        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        // Handle next song when audio ended
        audio.onended = function() {
            if(_this.isRepeat) {
            } else {
                nextBtn.click();
            }
            audio.play();
        }


        // When the song progress changes
        audio.ontimeupdate = function(e) {
            if (!_this.isSeeking && audio.duration) {
                const listDurationTime = $('.playlist__list-song.active .playlist__song-time')
                trackTime.innerHTML = _this.audioCalTime(audio.currentTime);
                progress.value = Math.floor(audio.currentTime / audio.duration * 100);
                if(listDurationTime.innerText === '--/--') {
                    _this.durationList.splice(_this.currentIndex, 1, _this.audioCalTime(audio.duration))
                    localStorage.setItem(DURATION_STORAGE_KEY, JSON.stringify(_this.durationList));
                    listDurationTime.innerHTML = _this.durationList[_this.currentIndex];
                    durationTime.innerHTML = _this.durationList[_this.currentIndex];
                }
            } else {
                // Handling when seek
                progress.onchange = function(e) {
                    const seekTime = e.target.value * audio.duration / 100;
                    audio.currentTime = seekTime;
                    trackTime.innerHTML = _this.audioCalTime(audio.currentTime);
                    _this.isSeeking = false;
                }
            }
        }
        
        function currentTime() {
            const seekTime = progress.value * audio.duration / 100;
            if(audio.duration) {
                trackTime.innerText = _this.audioCalTime(seekTime);
            }
        }

        // progress.addEventListener('touchmove', currentTime);
        progress.addEventListener('mousemove', currentTime);

        function seekStart() {
            _this.isSeeking = true;
        }

        // progressBlock.addEventListener('touchstart', seekStart);


        progressBlock.onmousedown = seekStart;

        

        //  Handle CD spins / stops
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)'}
        ], {
            duration: 10000, // 10000 seconds
            iterations: Infinity,
        })
        cdThumbAnimate.pause()



        // When next song
        nextBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.render()
            _this.scrollToActiveSong();
        }

        // When prev song
        prevBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.prevSong();
            }
            audio.play();
            _this.render()
            _this.scrollToActiveSong();
        };

        // Handling on / off random song
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom)
            this.classList.toggle('active', _this.isRandom)
        }

        // Single-parallel repeat processing
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat)
            this.classList.toggle('active', _this.isRepeat)
        }

        // Listen to playlist clicks
        songLists.forEach(songList => {
            songList.onclick = function(e) {
                const checkNode = e.target.closest('.playlist__song-check')
                const songNode = e.target.closest('.playlist__list-song:not(.active)');
                const optionNode = e.target.closest('.option')
                const activeOption = $('.option.active');
                if( songNode || optionNode || checkNode) {
                    // Handle when clicking on the song
                    if(songNode) {
                        _this.currentIndex = Number(songNode.dataset.index);
                        const songActives = $$(`.playlist__list-song[data-index="${_this.currentIndex}"]`)
                        _this.loadCurrentSong();
                        Array.from($$('.playlist__list-song.active')).forEach(songActive => {
                            songActive.classList.remove('active');
                        })
                        Array.from(songActives).forEach(songActive => {
                            songActive.classList.add('active');
                        })
                        audio.play();
                    }

                    //Handle when click on song checkbox
                    if(checkNode) {
                        checkNode.onclick = function(e) {
                            e.stopPropagation()
                        }
                    }
    
                    // Handle when clicking on the song option
                    if(optionNode) {
                        optionNode.classList.add('active');
                    }
                }
    
                if(activeOption && !e.target.closest('.option__block')) {
                    activeOption.classList.remove('active');
                }
            }
        })

        //Handle adjust volume change
        function changeVolume() {
            if(audio.volume * 100 != volume.value) {
                audio.volume = volume.value / 100;
                _this.setConfig('currentVolume', volume.value)
                if (!audio.volume) {
                    volumeBtn.classList.remove('bi-volume-up');
                    volumeBtn.classList.add('bi-volume-mute')
                } else {
                    volumeBtn.classList.add('bi-volume-up');
                    volumeBtn.classList.remove('bi-volume-mute')
                }
            }
        }
        
        volume.onchange = function(e) {
            changeVolume();
        }
        volume.onmousemove = function(e) {
            e.stopPropagation();
            changeVolume();
        }
        //Use addEventListener to fix the bug in the first loading
        // volume.addEventListener('touchmove', function(e) {
        //     e.stopPropagation();
        //     changeVolume();
        // })


        //Handle slide show
        let imgIndex = 2;
        function slideShow() {
            const slideImgFirst = $('.container__slide-item.first')
            const slideImgSecond = $('.container__slide-item.second')
            const slideImgThird = slideImgs[imgIndex]
            const slideImgFourth = slideImgs[imgIndex === slideImgs.length -1 ?  0 : imgIndex + 1]
            slideImgFourth.classList.replace('fourth', 'third')
            slideImgThird.classList.replace('third', 'second')
            slideImgSecond.classList.replace('second', 'first')
            slideImgFirst.classList.replace('first', 'fourth')
            imgIndex++;
            if(imgIndex >= slideImgs.length) { //imgIndex: 0-7, slideImgs.length: 8
                imgIndex = 0;
            }
            setTimeout(slideShow, 2000)
        }

        slideShow();


        
        // Handle when click on navbar
        navbarItems.forEach((navbarItem, index) => {
            navbarItem.onclick = function() {
                $('.content__navbar-item.active').classList.remove('active')
                navbarItem.classList.add('active')
                
                $('.container__tab.active').classList.remove('active')
                containerTabs[index].classList.add('active')
            }
        })


        //**  Handle when click button move MV, Playlist on tab HOME
        // Playlist
        playlistScrollBtns[0].onclick = function() {
            _this.plusSlides(-5, 0, playlistScrollBtns)
        }

        playlistScrollBtns[1].onclick = function() {
            _this.plusSlides(5, 0, playlistScrollBtns)
        }

        // Album
        albumScrollBtns[0].onclick = function() {
            _this.plusSlides(-5, 1, albumScrollBtns)
        }

        albumScrollBtns[1].onclick = function() {
            _this.plusSlides(5, 1, albumScrollBtns)
        }

        // MV
        mvScrollBtns[0].onclick = function() {
            _this.plusSlides(-3, 2, mvScrollBtns)
            console.log(_this.slideIndexs[2])
        }
        
        mvScrollBtns[1].onclick = function() {
            _this.plusSlides(3, 2, mvScrollBtns)
            console.log(_this.slideIndexs[2])
        }

        // Artist

        artistScrollBtns[0].onclick = function() {
            _this.plusSlides(-5, 3, artistScrollBtns)
        }

        artistScrollBtns[1].onclick = function() {
            _this.plusSlides(5, 3, artistScrollBtns)
        }
        
        


    },


    loadCurrentSong: function() {
        songTitle.textContent = this.currentSong.name;
        author.textContent = this.currentSong.singer
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = `${this.currentSong.path}`;
        durationTime.innerHTML = this.durationList[this.currentIndex];
        this.setConfig('currentIndex', this.currentIndex);
    },

    
    audioCalTime: function(time) {
        const minute = Math.floor(time / 60).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
        const second = Math.floor(time % 60).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
        return `${minute}:${second}`;
    },

    loadConfig: function() {
        this.isRandom = this.config.isRandom || false;
        this.isRepeat = this.config.isRepeat || false;
        this.currentIndex = this.config.currentIndex || 0;
        audio.volume = this.config.currentVolume == 0 ? 0 : this.config.currentVolume / 100 || 1;
        volume.value = this.config.currentVolume || 100;
        durationTime.textContent = this.audioCalTime(this.durationList[this.currentIndex]);
        randomBtn.classList.toggle('active', this.isRandom);
        repeatBtn.classList.toggle('active', this.isRandom);
    },

    setUpRender: function() {
        if(this.durationList.length === 0) {
            this.songs.forEach((song, index) => this.durationList.push('--/--'))
        }
    },

    nextSong: function() {
        this.currentIndex++;
            if(this.currentIndex >= this.songs.length) {
                this.currentIndex = 0;
            }
        this.loadCurrentSong();
    },

    prevSong: function() {
        this.currentIndex--;
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },

    playRandomSong: function() {
        let newIndex
    
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex || this.indexArray.includes(newIndex))
        this.indexArray.push(newIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
        if(this.indexArray.length === this.songs.length) {
            this.indexArray = [];
        }
    },

    scrollToActiveSong: function() {
        setTimeout(function() {
            if(app.currentIndex <= 6) {
                $('.playlist__list-song.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'end'
                })
            } else {
                $('.playlist__list-song.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                })
            }
        }, 200)
    },

    getSlideIndex(currentIndex, slideOrder, listItems, step) {
        if (currentIndex + step >= listItems.length) {
            this.slideIndexs[slideOrder] = listItems.length;
            this.scrollToRight = false;
        }
        if (currentIndex + step < 1) {
            this.slideIndexs[slideOrder] = 1;
            this.scrollToRight = true;
        }
        return currentIndex
    },

    plusSlides(step, slideOrder, listBtns) {
        const listItems = $$(this.slideSelectors[slideOrder])
        const currentIndex = this.getSlideIndex(this.slideIndexs[slideOrder] += step, slideOrder, listItems, step);

        if (currentIndex + step > listItems.length) {
            listBtns[1].classList.add('button--disabled')
            listBtns[0].classList.remove('button--disabled')
        } else if (currentIndex + step < 1) {
            listBtns[0].classList.add('button--disabled')
            listBtns[1].classList.remove('button--disabled')
        } else {
            Array.from(listBtns).forEach(itemBtn => {
                itemBtn.classList.remove('button--disabled')
            })
        }

        // Scroll Into View
        if( this.scrollToRight === true) {
            console.log(1)
            listItems[this.slideIndexs[slideOrder] - 1].scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'start'
            })
        } else if (this.scrollToRight === false) {
            console.log(0)
            listItems[this.slideIndexs[slideOrder] - 1].scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'end'
            })
        }
    },



    start: function() {
        //Setup duration time to render
        this.setUpRender()

        // Assign configuration from config to application
        this.loadConfig();
        
        
        // Define properties for the object
        this.defineProperties();
        
        // Render playlist
        this.render();

        
        // Listening / handling events (DOM events)
        this.handleEvents();
        
        
        
        // Load the first song information into the UI when running the app
        this.loadCurrentSong();
        
    }

}


app.start();
