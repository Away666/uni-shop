<template>
	<view class="scroll-view-container">
		<!-- 左侧的滚动视图区域 -->
		<scroll-view class="left-scroll-view" scroll-y :style="{height: wh + 'px'}">
			<block v-for="(item, i) in cateList" :key="i">
				<view :class="['left-scroll-view-item', i === active ? 'active' : '']" @click="activeChanged(i)">
					{{item.cat_name}}
				</view>
			</block>
		</scroll-view>
		<!-- 右侧的滚动视图区域 -->
		<scroll-view class="right-scroll-view" scroll-y :style="{height: wh + 'px'}" :scroll-top="scrollTop">
			<view class="cate-lv2" v-for="(item2, i2) in cateLevel2" :key="i2">
				<view class="cate-lv2-title">/ {{item2.cat_name}} /</view>
				<!-- 动态渲染三级分类的列表数据 -->
				<view class="cate-lv3-list">
					<!-- 三级分类 Item 项 -->
					<view class="cate-lv3-item" v-for="(item3, i3) in item2.children" :key="i3"
						@click="gotoGoodsList(item3)">
						<!-- 图片 -->
						<image :src="item3.cat_icon"></image>
						<!-- 文本 -->
						<text>{{item3.cat_name}}</text>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				wh: 0,
				cateList: [],
				cateLevel2: [],
				active: 0,
				// 滚动条距离顶部的距离
				scrollTop: 0
			};
		},
		methods: {
			getCateList() {
				uni.$http.get('/api/public/v1/categories').then((res) => {
					if (res.statusCode === 200) {
						this.cateList = res.data.message
						res.data.message[0].children.forEach((item1) => {
							item1.children.forEach((item2) => {
								// 接口里的图片需要把dev换成web
								item2.cat_icon = item2.cat_icon.replace('dev', 'web')
							})
						})
						this.cateLevel2 = res.data.message[0].children
						uni.$showMsg('数据请求成功！')
					} else {
						return uni.$showMsg()
					}
				})
			},
			activeChanged(i) {
				this.active = i
				this.cateLevel2 = this.cateList[i].children
				this.cateLevel2.forEach((item1) => {
					if (item1.children && item1.children[0].cat_icon.indexOf('dev')) {
						item1.children.forEach((item2) => {
							// 接口里的图片需要把dev换成web
							item2.cat_icon = item2.cat_icon.replace('dev', 'web')
						})
					} else {
						return
					}
				})
				// 让 scrollTop 的值在 0 与 1 之间切换
				this.scrollTop = this.scrollTop === 0 ? 1 : 0
			},
			gotoGoodsList(item3) {
				uni.navigateTo({
					url: '/subpkg/goods_list/goods_list?cid=' + item3.cat_id
				})
			}
		},
		onLoad() {
			const sysInfo = uni.getSystemInfo().then(res => {
				this.wh = res[1].windowHeight
			})
			this.getCateList()
		}
	}
</script>

<style lang="scss">
	.scroll-view-container {
		display: flex;

		.left-scroll-view {
			width: 120px;

			.left-scroll-view-item {
				line-height: 60px;
				background-color: #f7f7f7;
				text-align: center;
				font-size: 12px;

				// 激活项的样式
				&.active {
					background-color: #ffffff;
					position: relative;

					// 渲染激活项左侧的红色指示边线
					&::before {
						content: ' ';
						display: block;
						width: 3px;
						height: 30px;
						background-color: #c00000;
						position: absolute;
						left: 0;
						top: 50%;
						transform: translateY(-50%);
					}
				}
			}
		}

		.right-scroll-view {
			.cate-lv2-title {
				font-size: 12px;
				font-weight: bold;
				text-align: center;
				padding: 15px 0;
			}

			.cate-lv3-list {
				display: flex;
				flex-wrap: wrap;

				.cate-lv3-item {
					width: 33.33%;
					margin-bottom: 10px;
					display: flex;
					flex-direction: column;
					align-items: center;

					image {
						width: 60px;
						height: 60px;
					}

					text {
						font-size: 12px;
					}
				}
			}
		}
	}
</style>
