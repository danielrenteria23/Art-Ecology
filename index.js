$(function () {
	var myCanvas, context, width, height;
	var lines = [], numberOfLines = 12;
	var colors = ['#FFD800','#FF6A00','#FF0000','#0094FF','#0026FF','#4800FF','#7FFF8E','#B6FF00','#4CFF00', '#FFFFFF'];

	var Line = function() {
		return {
			x: 0,
			y: 0,
			size: 1,
			color: '#FFFFFF',
			distance: 100,
			speed: 200,
			increment: 0.6,
			turn: 70,
			wobble: 10000,
			rotation: random(0, 359),
			randomVariance: 0,
			opacity: 0.8,
			clockwise: true,
			glow: true,
			interval: {},
			tick: function() {
				var oldX = this.x;
				var oldY = this.y;

				if (this.clockwise)
					this.rotation -= this.turn;
				else
					this.rotation += this.turn;

				if (this.wobble) {
					if (this.rotation < 0) this.rotation += this.wobble;
					if (this.rotation >= this.wobble) this.rotation -= this.wobble;
				}

				this.x = this.x + this.distance * Math.sin(this.rotation);
				this.y = this.y + this.distance * Math.cos(this.rotation);

  

				drawLine(oldX, oldY, this.x, this.y, this.size, this.color, this.opacity);

				this.distance += this.increment;

				return this;
			},
			init: function(details) {
				for (var x in details) {
					this[x] = details[x];
				}

				var self = this;
				this.interval = setInterval(function() { self.tick(); }, this.speed);

				return this;
			},
			stop: function() {
				clearInterval(this.interval);
			}
		};
	};

	if ($("canvas").length > 0) {
		myCanvas = $("#canvas")[0];
		context = myCanvas.getContext("2d");
		resizeCanvas();
		eventListeners();
		startAnimation();
	}

	function resizeCanvas() {
		myCanvas.width = $("canvas").width();
	    myCanvas.height = $("canvas").height();
	    width = myCanvas.width;
		height = myCanvas.height;
	}

	$(window).on('resize', resizeCanvas);

	function eventListeners() {
		$('#submit').on('click', function() {
			var options = {};

			$('#controls input[type="text"]').each(function() {
				options[$(this).attr('id')] = checkNumber($(this).val());
			});

			numberOfLines = options.numberOfLines;

			var shareString = '';

			for (var x in options) {
				shareString += options[x] + '|';
			}

			$('#sharecode').val(shareString);

			startAnimation(options);
			return false;
		});

		$('#textMessages').on('click', function() {
			textMessagesSettings();
		});

		$('#emails').on('click', function() {
			emailSettings();
		});
  
        $('#internetUsers').on('click', function() {
            internetUsersSettings();
        });
  
        $('#websites').on('click', function() {
            websitesSettings();
        });

		$('#download').on('click', function() {
      		var image = myCanvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
			var filename = 'spiral_' + (new Date()).getTime() + '.png';

			$(this).attr('href', image).attr('download', filename);
		});

		$('#sharecode')
		.on('paste', function() {
			setTimeout(function() {
				var shareString = $('#sharecode').val().split('|');

				$('#controls input[type="text"]').not('#sharecode').each(function(x) {
					$(this).val(shareString[x]);
				});

				$('#submit').trigger('click');
			}, 100);
		})
		.on('focus', function() {
			$(this).select();
		});
	}

	function textMessagesSettings() {
		var settings = {
			numberOfLines:    66.,
			size:             .0061,
			distance:         66.6,
			speed:            .01,
			increment:        .7,
			turn:             15,
			wobble:           5,
			opacity:          .9,
			randomVariance:   0
		};

		for (var x in settings) {
			$('#' + x).val(settings[x]);
		}

		$('#submit').trigger('click');
	}
  
  function emailSettings() {
		var settings = {
  numberOfLines:    50,
  size:             .5,
  distance:         25,
  speed:            .1,
  increment:        .6,
  turn:             25,
  wobble:           5,
  opacity:          .8,
  randomVariance:   0
		};
  
		for (var x in settings) {
  $('#' + x).val(settings[x]);
		}
  
		$('#submit').trigger('click');
  }
  
  function internetUsersSettings() {
		var settings = {
  numberOfLines:    6,
  size:             1,
  distance:         100,
  speed:            200,
  increment:        .6,
  turn:             70,
  wobble:           10000,
  opacity:          .9,
  randomVariance:   0
		};
  
		for (var x in settings) {
  $('#' + x).val(settings[x]);
		}
  
		$('#submit').trigger('click');
  }
  
  
  function websitesSettings() {
		var settings = {
  numberOfLines:    6,
  size:             1,
  distance:         40,
  speed:            250,
  increment:        .1,
  turn:             70,
  wobble:           1000,
  opacity:          .9,
  randomVariance:   0
		};
  
		for (var x in settings) {
  $('#' + x).val(settings[x]);
		}
  
		$('#submit').trigger('click');
  }
  
  

	function startAnimation(options) {
    	options = options ? options : {};

		options.x = width / 2;
		options.y = height / 2;

		context.clearRect(0, 0, width, height);
		context.fillStyle = '#000000';
		context.globalAlpha = 1;
		context.fillRect(0, 0, width, height);

		for (var x = 0; x < lines.length; x++) {
			lines[x].stop();
		}

		lines = [];

		for (var y = 0; y < numberOfLines; y++) {
			options.color = colors[random(0, colors.length - 1)];
			options.rotation = (360 / numberOfLines) * y;
			lines.push(
				Line().init(options)
			);
		}
	}

	function drawPoint(x, y, size, color) {
		context.fillStyle = color;
		context.fillRect(x, y, size, size);
	}

	function drawLine(x1, y1, x2, y2, size, color, opacity) {
		setOpacity(opacity);
		context.beginPath();
		context.strokeStyle = color;
		context.lineWidth = size;
		context.moveTo(x1, y1);
		context.lineTo(x2, y2);
		context.stroke();
		context.closePath();
	}

	function setOpacity(alpha) {
		context.globalAlpha = alpha;
	}

	function random(min, max)
    {
		return (Math.floor(Math.random() * ((max - min) + 1) + min));
	}

	function checkNumber(n) {
		n = parseFloat(n);
		if (isNaN(n) || n < 0) n = 0;

		return n;
	}
});
