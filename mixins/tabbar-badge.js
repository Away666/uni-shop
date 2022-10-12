import {
	mapGetters,
	mapState
} from 'vuex'

// 导出一个 mixin 对象
export default {
	computed: {
		...mapState('m_cart', ['cart']),
		...mapGetters('m_cart', ['total']),
	},
	onShow() {
		// 在页面刚展示的时候，设置数字徽标
		this.setBadge()
	},
	methods: {
		setBadge() {
			// 调用 uni.setTabBarBadge() 方法，为购物车设置右上角的徽标
			uni.setTabBarBadge({
				index: 2,
				text: this.cart.length + '', // 注意：text 的值必须是字符串，不能是数字
			})
		},
	},
	watch: {
		'cart.length': {
			handler(newVal) {
				this.setBadge()
				// const findResult = this.options.find(x => x.text === '购物车')
				// if (findResult) {
				// 	findResult.info = newVal
				// }
			},
			immediate: true,
		},
	}
}
