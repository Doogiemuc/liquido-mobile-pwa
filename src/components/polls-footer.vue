<template>
	<footer>
		<ul id="navArrows" class="nav nav-arrows" >
			<li :class="{'active': activeStatus === 'ELABORATION', 'none-selected': activeStatus === undefined }">
				<a href="#" @click="clickFooter('ELABORATION')" id="elaborationArrow">
					<i class="far fa-comments"></i>
					<div class="icon-title">{{$t('elaboration')}}</div>
				</a>
			</li>
			<li :class="{'active': activeStatus === 'VOTING', 'none-selected': activeStatus === undefined }">
				<a href="#" @click="clickFooter('VOTING')" id="votingArrow">
					<i class="fas fa-person-booth"></i>
					<div class="icon-title">{{$t('inVoting')}}</div>
				</a>
			</li>
			<li :class="{'active': activeStatus === 'FINISHED', 'none-selected': activeStatus === undefined }">
				<a href="#" @click="clickFooter('FINISHED')" id="finishedArrow">
					<i class="fas fa-check"></i>
					<div class="icon-title">{{$t('finished')}}</div>
				</a>
			</li>
		</ul>
	</footer>
</template>

<script>

export default {
	name: "LiquidoFooter",
	props: {
		'activeStatus': { type: String, required: false }
	},
	data() { 
		return {} 
	},
	created() {},
	mounted() {},
	computed: {},
	methods: {
		clickFooter(filterValue) {
			this.$emit('clickFooter', filterValue)
		}
	},
}
</script>

<style lang="scss" scoped>

// mobile navbar at the bottom
footer {
	position: fixed;
	width: 100%;
	bottom: 0;
	left: 0;
	right: 0;
	z-index: 999;
	//transform: translateY(calc(100% - 40px));
	//transition: all .3s ease;

	font-size: 1.7rem;
	border-top: 1px solid rgba(0,0,255, 0.3);
	background-color: rgba(220, 236, 255, 1.0);
}


$inactiveNavArrowBg: #fdfdff;
$arrowSize: 28px;

#navArrows {
	flex-wrap: nowrap;
	padding: 0;
	//min-width: 350px;	
	text-align: center;
	//justify-content: center;
	font-family: 'Libre Baskerville', serif;
	font-size: 1.7rem;
	margin: 5px 0;
	transition: 0.3s;
	.icon-title {
		font-size: 10px;
		line-height: 1.0;
	}
}



#navArrows > li {
	margin: 0 $arrowSize*0.5;
	position: relative;
	flex-grow: 1;		
	flex-basis: 0;  // make all li elemns the same width (independant of their content)
	transition: 0.5s;
}
#navArrows a {
	display: block;
	white-space: nowrap;
	overflow: hidden;
	//text-overflow: ellipsis;
	color: lightgrey;
	height: 2 * $arrowSize;
	line-height: 40px;   				// vertically center text in arrows
	background-color: $inactiveNavArrowBg;
	transition: 0.5s;
}
/* Wings before each element */
#navArrows li:not(:first-child) > a:before {
	position: absolute;
	content: "";
	top: 0px;
	left: -$arrowSize*0.75;
	width: 0px;
	height: 0px;
	border-style: solid;
	border-width: $arrowSize 0 $arrowSize $arrowSize*0.75;
	border-color: $inactiveNavArrowBg $inactiveNavArrowBg $inactiveNavArrowBg transparent;
	z-index: 150;
	transition: 0.3s;
}
/* Rounded corners for first element at the left */
#navArrows > li:first-child > a {
	border-top-left-radius: $arrowSize*0.3;
	border-bottom-left-radius: $arrowSize*0.3;
}

/* Arrowhead after each element */
#navArrows > li:not(:last-child) > a:after {
	position: absolute;
	content: "";
	top: 0px;
	right: -$arrowSize*0.75;
	width: 0px;
	height: 0px;
	border-style: solid;
	border-width: $arrowSize 0 $arrowSize $arrowSize*0.75;
	border-color: transparent transparent transparent $inactiveNavArrowBg;
	z-index: 150;
	transition: 0.5s;
}
/* Rounded corners for last element at the right */
#navArrows > li:last-child > a {
	border-top-right-radius: $arrowSize*0.3;
	border-bottom-right-radius: $arrowSize*0.3;
}

/* Navbar arrows when active */
#navArrows li.active a  {
	color: white;
	background-color: $primary;
	transition: 0.5s;
}
#navArrows li.active a:before {
	border-color: $primary $primary $primary transparent;
	transition: 0.5s;
}
#navArrows li.active a:after {
	border-color: transparent transparent transparent $primary;
	transition: 0.5s;
}

#navArrows li.none-selected a {
	color: $primary;
	transition: 0.5s;
}

/*
.circle-1 {
	background: white;
	width: 50px;
	height: 50px;
	border: 1px solid $primary;
	border-radius: 50%;
	font-size: 1.9rem;
	position: fixed;
	bottom: 0;
	left: 50%;
	transform: translateX(-50%);
}
*/

</style>
