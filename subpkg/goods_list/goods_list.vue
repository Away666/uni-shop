<template>
	<view>
		<view class="goods-list">
			<view v-for="(goods, i) in goodsList" :key="i" @click="gotoDetail(goods)">
				<!-- 为 my-goods 组件动态绑定 goods 属性的值 -->
				<my-goods :goods="goods"></my-goods>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 请求参数对象
				queryObj: {
					// 查询关键词
					query: '',
					// 商品分类Id
					cid: '',
					// 页码值
					pagenum: 1,
					// 每页显示多少条数据
					pagesize: 10
				},
				// 商品列表的数据
				goodsList: [],
				// 总数量，用来实现分页
				total: 0,
				isloading: false
			}
		},
		methods: {
			getGoodsList(cb) {
				this.isloading = true
				uni.$http.get('/api/public/v1/goods/search', this.queryObj).then((res) => {
					if (res.statusCode === 200) {
						this.goodsList = [...this.goodsList, ...res.data.message.goods]
						this.total = res.data.message.total
						uni.$showMsg('数据请求成功！')
					} else {
						return uni.$showMsg()
					}
				})
				this.isloading = false
				cb && cb()
			},
			// 点击跳转到商品详情页面
			gotoDetail(item) {
				uni.navigateTo({
					url: '/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
				})
			}
		},
		onLoad(options) {
			this.queryObj.query = options.query || ''
			this.queryObj.cid = options.cid || ''
			this.getGoodsList()
		},
		// 下拉触底
		onReachBottom() {
			if (this.queryObj.pagenum * this.queryObj.pagesize >= this.total) return uni.$showMsg('全部数据已加载完！')
			if (this.isloading) return
			// 让页码值自增 +1
			this.queryObj.pagenum += 1
			// 重新获取列表数据
			this.getGoodsList()
		},
		// 下拉刷新的事件
		onPullDownRefresh() {
			// 1. 重置关键数据
			this.queryObj.pagenum = 1
			this.total = 0
			this.isloading = false
			this.goodsList = []

			// 2. 重新发起请求
			this.getGoodsList(() => uni.stopPullDownRefresh())
		}
	}
</script>

<style lang="scss">

</style>
