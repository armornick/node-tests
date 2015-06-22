$(function () {
	
		// cached elements =====================================================

		var addVideoForm = $("#add-video"), videoListSection = $("#video-list"), videoDetailSection = $('#show-video');

		var YOUTUBE_PATTERN     = /youtube\.com\/watch\?v=([a-zA-Z0-9]+)/,
			VIMEO_PATTERN       = /vimeo\.com\/([a-zA-Z0-9]+)/
			DAILYMOTION_PATTERN = /dailymotion\.com\/video\/([a-zA-Z0-9]+)/

		// utility functions ===================================================

		// decode video url to site and code -----------------------------------
		function decodeVideoUrl (data, url) {
			if (!url) { throw "URL string should not be empty."; }

			if (url.match(YOUTUBE_PATTERN)) {
				data.code = YOUTUBE_PATTERN.exec(url)[1];
				data.site = "youtube";
			} else if (url.match(VIMEO_PATTERN)) {
				data.code = VIMEO_PATTERN.exec(url)[1];
				data.site = "vimeo";
			} else if (url.match(DAILYMOTION_PATTERN)) {
				data.code = DAILYMOTION_PATTERN.exec(url)[1];
				data.site = "dailymotion";
			} else {
				throw "Unknown video site.";
			}
		}

		// generate embed url for video site & code ---------------------------
		// based on: http://code.tutsplus.com/articles/quick-tip-your-own-video-shortcode--wp-25516
		function getVideoEmbedSrc (site, code) {
			switch (site) {
				case "youtube":
					return "https://www.youtube-nocookie.com/embed/" + code;

				case "vimeo":
					return "https://player.vimeo.com/video/" + code;

				case "dailymotion":
					return "https://www.dailymotion.com/embed/video/" + code;

				default:
					throw "Unknown video site.";
			}
		}

		// view model =========================================================

		function VideoViewModel () {
			var self = this;

			// list of videos ------------------------------------------------
			self.videos = ko.observableArray([]);

			// currently selected video --------------------------------------
			self.currentVideo = ko.observable();

			self.currentVideoSrc = ko.computed(function () {
				var data = self.currentVideo();
				if (!data) { return ""; }
				return getVideoEmbedSrc(data.site, data.code);
			})

			// list of categories ---------------------------------------------
			self.categories = ko.computed(function () {
				var cats = {}, videos = self.videos();

				videos.forEach(function (item) {
					cats[item.category] = true;
				})

				return Object.keys(cats);
			})

			// fields for the "add video" form -------------------------------
			self.newVideoTitle = ko.observable();
			self.newVideoUrl = ko.observable();
			self.newVideoCategory = ko.observable();

			// toggle "add video" form visibility ----------------------------
			self.showAddVideoForm = function () {
				videoListSection.addClass('hide');
				videoDetailSection.addClass('hide');
				addVideoForm.removeClass('hide');
			}

			// clear "add video" form fields ---------------------------------
			self.clearVideoForm = function () {
				self.newVideoTitle(null);
				self.newVideoUrl(null);
				self.newVideoCategory(null);
			}

			// toggle video list visibility ----------------------------------
			self.showVideoList = function () {
				addVideoForm.addClass('hide');
				videoDetailSection.addClass('hide');
				videoListSection.removeClass('hide');
			}

			// toggle video detail visibility ----------------------------------
			self.showVideoDetail = function () {
				addVideoForm.addClass('hide');
				videoListSection.addClass('hide');
				videoDetailSection.removeClass('hide');
			}

			// open video screen ----------------------------------------------
			self.goToVideo = function (video) {
				self.currentVideo(video);
				self.showVideoDetail();

				console.log(self.currentVideo());
			}

			// close currently opened video -----------------------------------
			self.closeVideo = function () {
				self.currentVideo(null);
				self.showVideoList();
			}

			// function to add video ------------------------------------------
			self.addVideo = function () {
				try {
					var data = { title: self.newVideoTitle(), category: self.newVideoCategory() };
					decodeVideoUrl(data, self.newVideoUrl());

					$.post("/api/video/add", data)
						.done(function (result) {
							console.log(result);
							self.refreshVideoData();
							self.showVideoList();
							self.clearVideoForm();
						});
				} catch (err) {
					console.log(err);
				}
			}

			// get videos via ajax -------------------------------------------
			self.refreshVideoData = function () {
				$.getJSON("/api/videos/all", function (data) {
					self.videos(data);
				});
			}

			// init viewmodel ------------------------------------------------
			self.refreshVideoData();

		}

		// activate knockout ==================================================

		ko.applyBindings(new VideoViewModel());

});