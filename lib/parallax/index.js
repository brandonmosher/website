function init() {
    const style = document.createElement('style');
    style.id = 'parallax-style';

    const parallaxGroupClassCSS =  [
        'perspective-origin: bottom',
        'transform-style: preserve-3d'
    ]
    
    const parallaxLayerClassCSS =  [
        'position: absolute',
        'top: 0',
        'transform-origin: bottom',
        'height: 100%',
        'width: 100%'
    ];

    const layers = document.querySelectorAll('.parallax-layer');
    const perspective = layers.length;
    parallaxGroupClassCSS.push(`perspective: ${perspective}px`)
        
    layers.forEach((layer, i) => {
        const parallaxLayerCSS = [];
        const translateZ = i;
        const scale = 1 + (translateZ / perspective);
        layer.id = `parallax-layer-${i}`;
        if(translateZ > 0) {
            parallaxLayerCSS.push(`transform: translate3d(calc(-1 * (100vw - 100%) * ${translateZ / (2 * perspective)}), 0,-${translateZ}px) scale(${scale})`);
        }
        parallaxLayerCSS.push(`z-index: ${perspective - translateZ}`);
        style.innerHTML += `#${layer.id}{${parallaxLayerCSS.join(';')}}`;
    });

    style.innerHTML += `.parallax-layer{${parallaxLayerClassCSS.join(';')}}`;
    style.innerHTML += `.parallax-group{${parallaxGroupClassCSS.join(';')}}`;
    document.head.appendChild(style);
}

init();