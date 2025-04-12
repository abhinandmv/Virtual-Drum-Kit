    const drums = document.querySelectorAll('.drum');
    const visualizerBars = document.querySelectorAll('.visualizer-bar');
    
    let audioContext;
    let analyzer;
    
    function initAudio() {
      if (!audioContext) {
        try {
          audioContext = new (window.AudioContext || window.webkitAudioContext)();
          analyzer = audioContext.createAnalyser();
          analyzer.fftSize = 32;
        } catch (e) {
          console.log('Web Audio API not supported in this browser');
        }
      }
    }

    function playSound(soundPath) {
      initAudio();
      const audio = new Audio(soundPath);
      audio.play();
      if (audioContext && analyzer) {
        const source = audioContext.createMediaElementSource(audio);
        source.connect(analyzer);
        analyzer.connect(audioContext.destination);
        animateVisualizer();
      }
    }
    
    function animateVisualizer() {
      if (!analyzer) return;
      
      const bufferLength = analyzer.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      function animate() {
        analyzer.getByteFrequencyData(dataArray);
        visualizerBars.forEach((bar, index) => {
          const barIndex = index % bufferLength;
          const barHeight = (dataArray[barIndex] / 255) * 50;
          bar.style.height = barHeight + 'px';
        });
        
        requestAnimationFrame(animate);
      }
      
      animate();
    }
    
    drums.forEach(drum => {
      drum.addEventListener('click', function() {
        const key = this.getAttribute('data-key');
        const soundPath = this.getAttribute('data-sound');
        playSound(soundPath);
        buttonAnimation(key);
      });
    });

    document.addEventListener('keydown', function(event) {
      const key = event.key.toLowerCase();
      const drum = document.querySelector(`.drum[data-key="${key}"]`);
      
      if (drum) {
        const soundPath = drum.getAttribute('data-sound');
        playSound(soundPath);
        buttonAnimation(key);
      }
    });
    
    function buttonAnimation(key) {
      const activeButton = document.querySelector(`.${key}`);
      
      if (activeButton) {
        activeButton.classList.add('pressed');
        
        setTimeout(function() {
          activeButton.classList.remove('pressed');
        }, 100);
      }
    }
