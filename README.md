# NotExploreNow
现在不看，一个Chrome插件，自动回收暂时用不上的页面
# 介绍
本插件瞄准多数人的心理特征，创新性地提出帮助用户关闭不需要的标签页，主要逻辑部分模拟了浏览器tab，用一个Map将打开的标签页以存储起来，正在被浏览的标签页由一个变量进行存储。通过一个定时器每隔一段时间扫描这个Map，将其中超过时间不活跃的标签页回收到另一个Map中，前台可以通过这个Map重新打开标签页。这个插件还创新性地加入了休眠检测和最小化检测，即当电脑处于休眠或是浏览器处于最小化时回收服务自动暂停，做到智能回收，将误回收的可能性降到最低
![未命名文件.png](https://res.shirakawatyu.top/a8a90b5ccf7d4577b8b162ee931ecbfd.png)
# 技术栈
<table border="0">
<tr>
<td>JS Framework</td>
<td>JQuery</td>
</tr>
<tr>
<td>CSS Framework</td>
<td>Animate.css</td>
</tr>
 <tr>
<td>CSS Framework</td>
<td>Bootstrap</td>
</tr>
</table>
