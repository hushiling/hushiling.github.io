/***************************************************************************
*
* Copyright (C) 2014 Baidu.com, Inc. All Rights Reserved
*
***************************************************************************/

/**
 * @file list.js ~ 2014-03-21 23:42
 * @author sekiyika (px.pengxing@gmail.com)
 * @description
 *  点菜页面的js文件
 */

$(function() {

    // 给每个li加上index
    $('.carousel-inner li').each(function(index, li) {
        $(li).data('data-index', index);
    });

    var inner = $('.carousel-inner');
    var offset = 74;

    /**
     * 更新小卡片中的信息
     */
    function updateInfo(active) {
        $('.info-name').html(active.data('name'));   
        $('.info-price strong').html(active.data('price'));
    };

    /**
     * 处理滑动
     */
    function swipe(target, active) {
        var index = target.data('data-index');
        index = parseInt(index);
        var currentIndex = active.data('data-index');
        currentIndex = parseInt(currentIndex);

        var position = inner.position();
        var left = position.left;

        if(index > currentIndex) {
            // 后面一张图片
            inner.css('-webkit-transform', 'translate3d(' + (left - offset) + 'px,0,0)');
            target.removeClass().addClass('carousel-active');
            target.next().removeClass().addClass('carousel-next');
            target.next().next().removeClass().addClass('carousel-last');
            active.removeClass().addClass('carousel-prev');
            active.prev().removeClass().addClass('carousel-first');
            active.prev().prev().removeClass();
        } else {
            // 前面一张图片
            inner.css('-webkit-transform', 'translate3d(' + (left + offset) + 'px,0,0)');
            target.removeClass().addClass('carousel-active');
            target.prev().removeClass().addClass('carousel-prev');
            target.prev().prev().removeClass().addClass('carousel-fisrst');
            active.removeClass().addClass('carousel-next');
            active.next().removeClass().addClass('carousel-last');
            active.next().next().removeClass();
        }

        updateInfo(target);
    };

    $('#carousel li').on('click', function(event) {
        var target = $(this);
        if(!(target.hasClass('carousel-prev') || target.hasClass('carousel-next'))) {
            return;
        }
        var active = $('.carousel-active');
        swipe(target, active);
    });

    $('#carousel').on('swipeLeft', function(event) {
        var active = $('.carousel-active');
        var target = active.next();
        if(target.length == 0) {
            return;
        }
        swipe(target, active);
    });
    $('#carousel').on('swipeRight', function(event) {
        var active = $('.carousel-active');
        var target = active.prev();
        if(target.length == 0) {
            return;
        }
        swipe(target, active);
    });


    // 绑定来一份的事件
    $('.pick-btn').click(function() {
        var active = $('.carousel-active');

        /*
        var position = active.offset();
        var imageNode = $(active[0].cloneNode(true));
        imageNode.addClass('item-drag').css({
            'position': 'absolute',
            'left': position.left + 4 + 'px',
            'top': position.top + 'px',
        });

        imageNode.appendTo(document.body);
        */

       $([
         '<div class="food-item">',
            '<img src="' + active.find('img').attr('src') + '" />',
            '<div class="food-item-info clearfix">',
                '<div class="food-item-name">' + active.data('name') + '</div>',
                '<div class="food-item-price">&yen;<em>' + active.data('price') + '</em></div>',
            '</div>',
         '</div>'
       ].join('')).appendTo($('.food-list'));

        updateTotalPrice();
    });

    function updateTotalPrice() {
        var items = $('.food-item');

        if(items.length == 0) {
            $('.food-none').show();
            $('.submit-btn').hide();
            return;
        }

        var totalPrice = 0;
        items.each(function(i, item) {
            var price = parseInt($(item).find('em').html().trim());
            if(price >= 0) {
                totalPrice += price;
            }
        });

        $('.foods-info').html('共计：' + items.length + '个菜，' + totalPrice + '元').show();
        $('.submit-btn').show();
        $('.food-none').hide();
    };
});

