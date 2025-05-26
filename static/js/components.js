//设置图片宽度
function setImgWidth(curComInner, cropping, comColumn, imgPadding, imgMargin, columnWidth, columnHeight, imgBorder) {
    var imgList = curComInner.find('div.gallery-img-in img');
    var setImgCss = function (curImgItem) {
        var imgWidth = curImgItem.width();
        if (!(imgWidth > 0))
            return false;
        var imgHeight = curImgItem.height();
        var widthThan = 100;
		var heightThan = 100;
		var temBorder=0;
        var leftThan = 0;
        var topThan = 0;
		var temMargin = 0;
		var tempadding = 0;
		if (imgBorder > 0){
		   temBorder = imgBorder;
		}
		if (imgPadding > 0){
			tempadding += ( parseInt(imgPadding) + parseInt(temBorder)) * 2;
		}
		if (imgMargin > 0){
			temMargin += parseInt(imgMargin) * 2;
		}
		var newColumnWidth = columnWidth - temMargin - tempadding;
		var newColumnHeight = columnHeight;
        //正常格式
        if (cropping == 0) {
			newColumnWidth = columnWidth - temMargin;
			imgWidth += tempadding;
			imgHeight += tempadding;
            if (imgWidth <= newColumnWidth && imgHeight <= newColumnHeight) {
                widthThan = 'auto';
				heightThan = 'auto';
                leftThan = (((newColumnWidth - imgWidth) / 2) / newColumnWidth) * 100;
                topThan = (((newColumnHeight - imgHeight) / 2) / newColumnHeight) * 100;
            } else {
                if (imgHeight > newColumnHeight) {
                    imgWidth = (newColumnHeight / imgHeight) * imgWidth;
                    imgHeight = newColumnHeight;
                }
                if (imgWidth > newColumnWidth) {
                    imgHeight = (newColumnWidth / imgWidth) * imgHeight;
                    imgWidth = newColumnWidth;
                }
                widthThan = ((imgWidth / newColumnWidth) * 100) + '%';
				heightThan = ((imgHeight / newColumnHeight) * 100) + '%';
                leftThan = (((newColumnWidth - imgWidth) / 2) / newColumnWidth) * 100;
                topThan = (((newColumnHeight - imgHeight) / 2) / newColumnHeight) * 100;
            }
            curImgItem.css({'width': widthThan, 'height': heightThan, 'left': leftThan + '%', 'top': topThan + '%'});
        } else {
            //正方形和长方形
            var imgNewHeight = imgHeight * (newColumnWidth / imgWidth);
            if (imgNewHeight < newColumnHeight) {
                imgWidth = (newColumnHeight / imgNewHeight) * newColumnWidth;
                widthThan = (imgWidth / newColumnWidth) * 100;
                leftThan = 0 - (((imgWidth - newColumnWidth) / 2) / newColumnWidth) * 100;
            } else {
                imgHeight = imgNewHeight;
				heightThan = (imgHeight / newColumnHeight) * 100;
                topThan = 0 - ((((imgHeight - newColumnHeight) / 2) / newColumnHeight) * 100);
            }
            curImgItem.css({'width': widthThan + '%', 'height': heightThan + '%', 'left': leftThan + '%', 'top': topThan + '%'});
        }
    }

    // 判断图片加载的函数
    var newIsImgLoad = function (_obj) {
        if (_obj.height() === 0) {
            var t_img;
            t_img = setInterval(function () {
                clearInterval(t_img);
                newIsImgLoad(_obj);
            }, 10);
        } else {
            setImgCss(_obj);
        }
    }

    for (var i = 0; i < imgList.length; i++) {
        var temImg = $(imgList[i]);
        temImg.css({'width': 'auto'});
        var newImg = new Image;
        newImg.index = i;
        newIsImgLoad($(imgList[i]));
        newImg.src = temImg.attr('src');
    }
}