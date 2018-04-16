$(function () {
    //时间
    function now(){
        var myDate = new Date(),
            h = myDate.getHours(),
            m = myDate.getMinutes(),
            s = myDate.getSeconds(),
            y = myDate.getFullYear(),
            mon = myDate.getMonth() + 1,
            d = myDate.getDate(),
            w = "星期" + "日一二三四五六".split(/(?!\b)/)[myDate.getDay()];
        h < 10 ? h= '0' + h : h;
        m < 10 ? m= '0' + m : m;
        s < 10 ? s= '0' + s : s;
        mon < 10 ? mon= '0' + mon : mon;
        d < 10 ? d= '0' + d : d;
        return{
            time : h+':'+m+':'+s,
            date : y + '年' + mon + '月' + d + '日',
            week : w
        }
    }
    $('#time').text(now().time);
    $('#date').text(now().date);
    $('#week').text(now().week);
    $('#calDate').text('农历：'+calDay);
    window.setInterval(function () {
        $('#time').text(now().time);
        $('#date').text(now().date);
        $('#week').text(now().week);
        $('#calDate').text('农历：'+calDay);
    },1000);



    //通知滚动
    $.fn.textScroll = function () {
        var speed = 60, flag = null, tt, that = $(this), child = that.children();
        var p_w = that.width(), w = child.width();
        child.css({left: p_w});
        var t = (w + p_w) / speed * 1000;
        function play(m) {
            var tm = m === undefined ? t : m;
            child.animate({left: -w}, tm, "linear", function () {
                $(this).css("left", p_w);
                play();
                });
        }
        child.on({
            mouseenter: function () {
                var l = $(this).position().left;
                $(this).stop();
                tt = (-(-w - l) / speed) * 1000;
                },
            mouseleave: function () {
                play(tt);
                tt = undefined;
            }
        });
        play();
    };
    $("#scrollBox").textScroll();



    //canvas
    function myCanvas(cId,cdata,color,color1) {
        var canvas = document.getElementById(cId),
            ctx = canvas.getContext('2d'),
            oW = canvas.width = 82,
            oH = canvas.height = 82,
            oRange= cdata,//数据
            lineWidth = 1,
            // 大半径
            r = (oW / 2),
            cR = r - 10*lineWidth;
        ctx.beginPath();
        ctx.lineWidth = lineWidth;
        // 水波动画初始参数
        var axisLength = 2*r - 16*lineWidth,  // Sin 图形长度
            unit = axisLength / 9, // 波浪宽
            range = .4 ,// 浪幅
            nowrange = range,
            xoffset = 8*lineWidth, // x 轴偏移量
            data = ~~(oRange) / 100,  // 数据量
            sp = 0, // 周期偏移量
            nowdata = 0,
            waveupsp = 0.006, // 水波上涨速度
            // 圆动画初始参数
            arcStack = [],  // 圆栈
            bR = r-8*lineWidth,
            soffset = -(Math.PI/2), // 圆动画起始位置
            circleLock = true; // 起始动画锁
        // 获取圆动画轨迹点集
        for(var i = soffset; i< soffset + 2*Math.PI; i+=1/(8*Math.PI)) {
            arcStack.push([
                r + bR * Math.cos(i),
                r + bR * Math.sin(i)
            ]);
        }
        // 圆起始点
        var cStartPoint = arcStack.shift();
        ctx.strokeStyle = color;
        ctx.moveTo(cStartPoint[0],cStartPoint[1]);
        // 开始渲染
        render();
        function drawSine () {
            ctx.beginPath();
            ctx.save();
            var Stack = []; // 记录起始点和终点坐标
            for (var i = xoffset; i<=xoffset + axisLength; i+=20/axisLength) {
                var x = sp + (xoffset + i) / unit;
                var y = Math.sin(x) * nowrange;
                var dx = i;
                var dy = 2*cR*(1-nowdata) + (r - cR) - (unit * y);
                ctx.lineTo(dx, dy);
                Stack.push([dx,dy])
            }
            // 获取初始点和结束点
            var startP = Stack[0];
            var endP = Stack[Stack.length - 1];
            ctx.lineTo(xoffset + axisLength,oW);
            ctx.lineTo(xoffset,oW);
            ctx.lineTo(startP[0], startP[1]);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.restore();
        }
        function drawText () {
            ctx.globalCompositeOperation = 'source-over';
            var size = 0.6*cR;
            ctx.font = 'bold ' + size + 'px Microsoft Yahei';
            var txt = (nowdata.toFixed(2)*100).toFixed(0) + '%';
            var fonty = r + size/2;
            var fontx = r - size * 0.8;
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.fillText(txt, r+2, r+8);
        }
        //最外面淡黄色圈
        function drawCircle(){
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = color;
            ctx.arc(r, r, cR+7, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.restore();
        }
        //灰色圆圈
        function grayCircle(){
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = color1;
            ctx.arc(r, r, cR+2, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.restore();
            ctx.beginPath();
        }
        //橘黄色进度圈
        function orangeCircle(){
            ctx.beginPath();
            ctx.strokeStyle = '#ffffff';
            //使用这个使圆环两端是圆弧形状
            ctx.lineCap = 'round';
            ctx.arc(r, r, cR+3,0/* * (Math.PI / 180.0)*/ - (Math.PI / 2),(nowdata * 360) * (Math.PI / 180.0) - (Math.PI / 2));
            ctx.stroke();
            ctx.save();
        }
        //裁剪中间水圈
        function clipCircle(){
            ctx.beginPath();
            ctx.arc(r, r, cR+2, 0, 2 * Math.PI,false);
            ctx.clip();
        }
        //渲染canvas
        function render () {
            ctx.clearRect(0,0,oW,oH);
            //最外面淡黄色圈
            drawCircle();
            //灰色圆圈
            grayCircle();
            //橘黄色进度圈
            orangeCircle();
            //裁剪中间水圈
            clipCircle();
            // 控制波幅
            data = ~~(oRange) / 100;
            if (data >= 0.85) {
                if (nowrange > range/4) {
                    var t = range * 0.01;
                    nowrange -= t;
                }
            } else if (data <= 0.1) {
                if (nowrange < range*1.5) {
                    var t = range * 0.01;
                    nowrange += t;
                }
            } else {
                if (nowrange <= range) {
                    var t = range * 0.01;
                    nowrange += t;
                }
                if (nowrange >= range) {
                    var t = range * 0.01;
                    nowrange -= t;
                }
            }
            if((data - nowdata) > 0) {
                nowdata += waveupsp;
            }
            if((data - nowdata) < 0){
                nowdata -= waveupsp
            }
            sp += 0.07;
            // 开始水波动画
            drawSine();
            // 写字
            drawText();
            requestAnimationFrame(render)
        }
    }
    myCanvas('c1',50,'#c82723','#410704');
    myCanvas('c2',25,'#026eb4','#053554');
    myCanvas('c3',70,'#256f2a','#033105');
    myCanvas('c4',80,'#ff8602','#5f3406');



    //告警工单统计
    (function () {
        var dom = document.querySelector('#echarts_01');
        var myChart = echarts.init(dom);

        var app = {},
            option = null;


        option = {
            title: [
                {
                    text: '告警工单统计',
                    textStyle: {
                        color: '#50c7ff',
                        fontSize: 18,
                    },
                    left: 0,
                    top: 20
                },
                {
                    text: '专业',
                    textStyle: {
                        color: '#fff',
                        fontSize: 18,
                        fontWeight: 400
                    },
                    top: 55,
                    left: 42
                },
                {
                    text: '中心',
                    textStyle: {
                        color: '#fff',
                        fontSize: 18,
                        fontWeight: 400
                    },
                    top: 55,
                    right: 345
                },
            ],
            grid: [
                {
                    left: 45,
                    top: 100,
                    x: '7%',
                    y: '7%',
                    width: '390',
                    height: '166'
                },
                {
                    right: 0,
                    top: 100,
                    x2: '7%',
                    y: '7%',
                    width: '390',
                    height: '166'
                }
            ],
            yAxis: [
                {
                    gridIndex: 0,
                    type: 'value',
                    min: 0,
                    max: 8000,
                    interval: 2000,
                    axisLine: {
                        show: true,
                        lineStyle: {
                            width: 2,
                            color: 'rgba(255, 255, 255, 0.3)'
                        }

                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        margin: 10,
                        color: '#fff',
                        fontSize: 14,
                        formatter: function (value, index) {
                            if (index === 0) {
                                return value + '(条)'
                            }
                            return value;
                        }
                    },
                    splitLine: {
                        show: false,
                        lineStyle: {
                            color: 'rgba(255, 255, 255, 0.3)',
                            width: 2
                        }
                    }
                },
                {
                    gridIndex: 1,
                    type: 'value',
                    min: 0,
                    max: 4000,
                    interval: 1000,
                    axisLine: {
                        show: true,
                        lineStyle: {
                            width: 2,
                            color: 'rgba(255, 255, 255, 0.3)'
                        }

                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        margin: 10,
                        color: '#fff',
                        fontSize: 14,
                        formatter: function (value, index) {
                            if (index === 0) {
                                return value + '(条)'
                            }
                            return value;
                        }
                    },
                    splitLine: {
                        show: false,
                        lineStyle: {
                            color: 'rgba(255, 255, 255, 0.3)',
                            width: 2
                        }
                    }
                },
                {
                    type: 'value',
                    gridIndex: 0,
                    min: 0,
                    max: 8000,
                    splitLine: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        show: false
                    },
                    splitArea: {
                        show: true,
                        areaStyle: {
                            color: ['rgba(250,250,250,0.0)', 'rgba(250,250,250,0.05)']
                        }
                    }
                },
                {
                    type: 'value',
                    gridIndex: 1,
                    min: 0,
                    max: 4000,
                    splitLine: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        show: false
                    },
                    splitArea: {
                        show: true,
                        areaStyle: {
                            color: ['rgba(250,250,250,0.0)', 'rgba(250,250,250,0.05)']
                        }
                    }
                }
            ],
            xAxis: [
                {
                    gridIndex: 0,
                    type: 'category',
                    data: ['3G', '4G', '光宽', '动力', '交换', '数据', '传输', 'IPRAN', '业务', '核心网'],
                    axisLine: {
                        lineStyle: {
                            color: '#fff',
                            width: 1,
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        interval: 0,
                        margin: 4,
                        color: '#fff',
                        fontSize: 13
                    }
                },
                {
                    gridIndex: 1,
                    type: 'category',
                    data: ['接入中心', '网优中心', '动力', '设备中心', '业务平台'],
                    axisLine: {
                        lineStyle: {
                            color: '#fff',
                            width: 1,
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        interval: 0,
                        margin: 4,
                        color: '#fff',
                        fontSize: 13
                    }
                }
            ],
            series: [
                {
                    xAxisIndex: 0,
                    yAxisIndex: 0,
                    name: '工单',
                    type: 'bar',
                    barWidth: 12,
                    data: [1000, 4500, 2700, 4900, 4100, 6800, 2000, 4400, 6100, 2700],
                    itemStyle: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0, color: '#1a98f8' // 0% 处的颜色
                            }, {
                                offset: 1, color: '#7049f0' // 100% 处的颜色
                            }],
                            globalCoord: false // 缺省为 false
                        }
                    },
                    // label: {
                    //     show: true,
                    //     position: 'top',
                    //     color: '#fff',
                    //     fontSize: 10
                    // }
                },
                {
                    xAxisIndex: 0,
                    yAxisIndex: 0,
                    name: '告警',
                    type: 'bar',
                    barWidth: 12,
                    data: [800, 3000, 1800, 2100, 2600, 2200, 1000, 2400, 2100, 2300],
                    itemStyle: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0, color: '#f7734e' // 0% 处的颜色
                            }, {
                                offset: 1, color: '#e12945' // 100% 处的颜色
                            }],
                            globalCoord: false // 缺省为 false
                        }
                    }
                },
                {
                    xAxisIndex: 1,
                    yAxisIndex: 1,
                    name: '工单',
                    type: 'bar',
                    data: [500, 2550, 2850, 1400, 3600],
                    itemStyle: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0, color: '#1a98f8' // 0% 处的颜色
                            }, {
                                offset: 1, color: '#7049f0' // 100% 处的颜色
                            }],
                            globalCoord: false // 缺省为 false
                        }
                    }
                },
                {
                    xAxisIndex: 1,
                    yAxisIndex: 1,
                    name: '告警',
                    type: 'bar',
                    data: [400, 1800, 1000, 1200, 2300],
                    itemStyle: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0, color: '#f7734e' // 0% 处的颜色
                            }, {
                                offset: 1, color: '#e12945' // 100% 处的颜色
                            }],
                            globalCoord: false // 缺省为 false
                        }
                    }
                }
            ],
            tooltip: {
                show: true
            },
            legend: {
                data: [{
                    name: '告警',
                    icon: 'circle'
                }, {
                    name: '工单',
                    icon: 'circle'
                }],
                align: 'left',
                right: 25,
                top: 25,
                itemGap: 15,
                itemWidth: 12,
                itemHeight: 12,
                textStyle: {
                    color: '#fff',
                    fontSize: 18
                }
            },
        }
        myChart.setOption(option);
    })();


    //告警统计
    function progress(ele,dataNum,maxNum) {
        var box = $(ele).children('div'),
            innerBox = box.children('div');
        $(ele).children('span:last-child').text(dataNum);
        innerBox.animate({
            width: dataNum/maxNum*100+'%'
        });
    }
    progress('#gj_1',92323,100000);
    progress('#gj_2',43653,100000);
    progress('#gj_3',23532,100000);
    progress('#gj_4',63522,100000);
    progress('#gj_5',32234,100000);

    //固网开通订单数
    progress('#xq_kt',5000,10000);
    progress('#xq_zt',980,10000);
    progress('#xq_kt_jj',3080,10000);
    progress('#xq_zt_jj',7500,10000);

    progress('#zq_kt',3500,10000);
    progress('#zq_zt',7500,10000);
    progress('#zq_kt_jj',9500,10000);
    progress('#zq_zt_jj',2500,10000);

    progress('#bq_kt',4500,10000);
    progress('#bq_zt',8500,10000);
    progress('#bq_kt_jj',2500,10000);
    progress('#bq_zt_jj',5500,10000);

    progress('#tz_kt',4500,10000);
    progress('#tz_zt',8500,10000);
    progress('#tz_kt_jj',2500,10000);
    progress('#tz_zt_jj',5500,10000);

    progress('#nq_kt',4500,10000);
    progress('#nq_zt',8500,10000);
    progress('#nq_kt_jj',2500,10000);
    progress('#nq_zt_jj',5500,10000);

    progress('#hd_kt',4500,10000);
    progress('#hd_zt',8500,10000);
    progress('#hd_kt_jj',2500,10000);
    progress('#hd_zt_jj',5500,10000);

    progress('#dx_kt',4500,10000);
    progress('#dx_zt',8500,10000);
    progress('#dx_kt_jj',2500,10000);
    progress('#dx_zt_jj',5500,10000);


    //饼图
    (function () {
        // 区域饼图数据
        var data_01 = [
            { value: 45, name: '北区' },
            { value: 20, name: '东区' },
            { value: 10, name: '海淀北' },
            { value: 41, name: '南区' },
            { value: 48, name: '通州' },
            { value: 67, name: '西区' },
            { value: 23, name: '政企部' }
        ];
        var data_02 = [
            { value: 45, name: '金融' },
            { value: 20, name: '企业' },
            { value: 10, name: '党政军' },
            { value: 41, name: '国际' },
            { value: 48, name: '传媒' },
            { value: 67, name: '互联网' },
            { value: 23, name: '行拓' }
        ];
        var data_03 = [
            { value: 45, name: '语音专线' },
            { value: 20, name: '互联网专线' },
            { value: 10, name: '数据专线' }
        ];
        var data_04 = [
            { value: 45, name: '10M~50M' },
            { value: 20, name: '100M~300M' },
            { value: 10, name: '2M~10M' },
            { value: 41, name: '2M以内' },
            { value: 48, name: 'GE以上' },
            { value: 67, name: '50M~100M' },
            { value: 23, name: '300M~622M' }
        ]



        // 饼图对象
        var appPie = {};

        // 初始化
        var myChart_02 = echarts.init(document.querySelector('#echarts_02'));

        // 获取legend函数
        function createLegendData(data) {
            var legend = [];
            data.forEach(function (item, index) {
                var obj = {};
                obj.name = item.name;
                obj.icon = 'circle';
                legend.push(obj);
            });
            return legend;
        }

        // 创建标题函数
        function createTitle(txt, left) {
            var title = {
                text: '{a|' + txt + '}',
                left: left,
                top: 0,
                textStyle: {
                    rich: {
                        a: {
                            color: '#ffffff',
                            fontSize: 18,
                            width: 220,
                            height: 26,
                            lineHeight: 26,
                            align: 'left'
                        }
                    }
                },
                backgroundColor: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 1,
                    y2: 0,
                    colorStops: [{
                        offset: 0, color: '#3949ab' // 0% 处的颜色
                    }, {
                        offset: 1, color: '#02041b' // 100% 处的颜色
                    }],
                    globalCoord: false // 缺省为 false
                },
                padding: [0, 0, 0, 8],
            };
            return title;
        };

        // 创建grid
        function createGrid(left) {
            var obj = {
                left: left,
                top: 70,
                width: 312,
                height: 225
            }
            return obj;
        }

        // 饼图数据
        appPie.data_01 = data_01.sort(function (a, b) { return a.value - b.value });
        appPie.data_02 = data_02.sort(function (a, b) { return a.value - b.value });
        appPie.data_03 = data_03.sort(function (a, b) { return a.value - b.value });
        appPie.data_04 = data_04.sort(function (a, b) { return a.value - b.value });

        appPie.LegendData_01 = createLegendData(appPie.data_01);
        appPie.LegendData_02 = createLegendData(appPie.data_02);
        appPie.LegendData_03 = createLegendData(appPie.data_03);
        appPie.LegendData_04 = createLegendData(appPie.data_04);


        // echarts参数设置
        option = {
            color: ['#f4511e', '#3949ab', '#1e88e5', '#00acc1', '#43a047', '#c0ca33', '#ffb300'],
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            title: [
                createTitle('区域', 35),
                createTitle('专线业务客户来源', 347),
                createTitle('产品', 660),
                createTitle('专线开通宽带分布 ', 971)
            ],
            grid: [
                createGrid(0),
                createGrid(312),
                createGrid(624),
                createGrid(936)
            ],
            legend: [{
                type: 'scroll',
                orient: 'vertical',
                left: 220,
                top: 65,
                data: appPie.LegendData_01,
                textStyle: {
                    color: '#ffffff',
                    fontSize: 14
                },
                itemWidth: 12,
                itemHeight: 12,
            }, {
                type: 'scroll',
                orient: 'vertical',
                left: 532,
                top: 65,
                data: appPie.LegendData_02,
                textStyle: {
                    color: '#ffffff',
                    fontSize: 14
                },
                itemWidth: 12,
                itemHeight: 12,
            }, {
                type: 'scroll',
                orient: 'vertical',
                left: 845,
                top: 65,
                data: appPie.LegendData_03,
                textStyle: {
                    color: '#ffffff',
                    fontSize: 14
                },
                itemWidth: 12,
                itemHeight: 12,
            }, {
                type: 'scroll',
                orient: 'vertical',
                left: 1160,
                top: 65,
                data: appPie.LegendData_04,
                textStyle: {
                    color: '#ffffff',
                    fontSize: 14
                },
                itemWidth: 12,
                itemHeight: 12,
            }],
            series: [{
                name: '区域',
                type: 'pie',
                radius: 72,
                center: [115, 145],
                data: appPie.data_01,
                label: {
                    position: 'inside',
                    fontSize: 12,
                    color: '#fff',
                    formatter: "{d}%"
                },
                labelLine: {
                    show: false
                },
                itemStyle: {
                    normal: {
                        shadowBlur: 10,
                        shadowColor: 'rgb(0, 0, 0)'
                    }
                }
            }, {
                name: '专线业务客户来源',
                type: 'pie',
                radius: 72,
                center: [425, 145],
                data: appPie.data_02,
                label: {
                    position: 'inside',
                    fontSize: 12,
                    color: '#fff',
                    formatter: "{d}%"
                },
                labelLine: {
                    show: false
                },
                itemStyle: {
                    normal: {
                        shadowBlur: 10,
                        shadowColor: 'rgb(0, 0, 0)'
                    }
                }
            }, {
                name: '产品',
                type: 'pie',
                radius: 72,
                center: [740, 147],
                data: appPie.data_03,
                label: {
                    position: 'inside',
                    fontSize: 12,
                    color: '#fff',
                    formatter: "{d}%"
                },
                labelLine: {
                    show: false
                },
                itemStyle: {
                    normal: {
                        shadowBlur: 10,
                        shadowColor: 'rgb(0, 0, 0)'
                    }
                }
            }, {
                name: '专线开通宽带分布',
                type: 'pie',
                radius: 72,
                center: [1050, 147],
                data: appPie.data_04,
                label: {
                    position: 'inside',
                    fontSize: 12,
                    color: '#fff',
                    formatter: "{d}%"
                },
                labelLine: {
                    show: false
                },
                itemStyle: {
                    normal: {
                        shadowBlur: 10,
                        shadowColor: 'rgb(0, 0, 0)'
                    }
                }
            }]

        };
        myChart_02.setOption(option);
    })();




});