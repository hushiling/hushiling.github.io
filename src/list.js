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

/**
 * 动画时间
 */
var animateTime = 500;

$(function() {

    // 给每个li加上index
    $('.carousel-inner li').each(function(index, li) {
        $(li).data('data-index', index);
    });

    var inner = $('.carousel-inner');
    var offset = 60;

    /**
     * 更新小卡片中的信息
     */
    function updateInfo(active) {
        $('.info-name').html(active.data('name'));   
        $('.info-price strong').html(active.data('price'));
    };

    var isMoving = false;
    /**
     * 处理滑动
     */
    function swipe(target, active) {
        if(isMoving) {
            return;
        }
        isMoving = true;
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
        setTimeout(function() {
            isMoving = false;
        }, animateTime);

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


    var scale = {
        x: 0.292,
        y: 0.292
    };
    // 绑定来一份的事件
    $('.pick-btn').click(function() {
        var active = $('.carousel-active');

        var position = active.offset();
        var imageNode = $(active[0].cloneNode(true));
        var nodePos = {
            left: position.left + 5,
            top: position.top
        };
        var node = $('<div class="item-drag animate"/>').append(imageNode).css({
            'position': 'absolute',
            'left': nodePos.left + 'px',
            'top': nodePos.top + 'px',
        });
        node.appendTo(document.body);

        var itemNode = $('<div class="food-item animate" />').appendTo($('.food-list'));

        var position = itemNode.position();
        var items = $('.food-item');
        position.left = position.left - nodePos.left - 78;
        if(items.length > 1) {
            // 不用考虑已经占位的东西，直接计算位置
            position.top = position.top - nodePos.top - 70;
        } else {
            // 计算“亲，来一个嘛~”的高度
            position.top = position.top - nodePos.top - 112;
        }

        node.css({
            '-webkit-transform': 'translate3d(' + position.left + 'px, ' + position.top + 'px, 0)'
        });
        node.find('li').css('-webkit-transform', 'scale3d(' + scale.x + ',' + scale.y + ', 1)');

        setTimeout(function() {
            itemNode.html([
                '<span class="close animate">+</span>',
                '<div class="food-item-inner">',
                    '<img src="' + active.find('img').attr('src') + '" />',
                    '<div class="food-item-info clearfix">',
                        '<div class="food-item-name">' + active.data('name') + '</div>',
                        '<div class="food-item-price">&yen;<em>' + active.data('price') + '</em></div>',
                    '</div>',
                '</div>'
            ].join(''));

            node.remove();

            // 绑定叉叉点击事件
            itemNode.find('.close').click(removeFood);

            setTimeout(function() {
                // 让叉叉转一下
                itemNode.find('.close').css({
                    '-webkit-transform': 'rotate(405deg)'
                });
            }, 10);
            updateTotalPrice();
        }, animateTime);

    });


    // 删除某个菜
    function removeFood(event) {
        var target = $(event.target);

        target.css('-webkit-transform', 'rotate(360deg)');
        target = target.parent('.food-item');

        target.css('opacity', 0);
        setTimeout(function() {
            target.remove();

            updateTotalPrice();
        }, animateTime);
    };


    function updateTotalPrice() {
        var items = $('.food-item');

        if(items.length == 0) {
            $('.foods-info').hide();
            $('.food-none').show();
            $('.submit-btn').hide();
            return;
        }

        var totalPrice = 0;
        items.each(function(i, item) {
            var price = parseInt($(item).find('em').html());
            if(price >= 0) {
                totalPrice += price;
            }
        });

        $('.foods-info').html('共计：' + items.length + '个菜，' + totalPrice + '元').show();
        $('.submit-btn').show();
        $('.food-none').hide();
    };
});

