<template>
	<footer>
		<ul id="navArrows" class="nav nav-arrows">
			<li
				:class="{
					active: activeStatus === 'ELABORATION',
					'none-selected': activeStatus === undefined,
				}"
			>
				<a id="elaborationArrow" href="#" @click="clickFooter('ELABORATION')">
					<i class="far fa-comments" />
					<div class="icon-title">{{ $t("Elaboration") }}</div>
				</a>
			</li>
			<li
				:class="{
					active: activeStatus === 'VOTING',
					'none-selected': activeStatus === undefined,
				}"
			>
				<a id="votingArrow" href="#" @click="clickFooter('VOTING')">
					<i class="fas fa-person-booth" />
					<div class="icon-title">{{ $t("InVoting") }}</div>
				</a>
			</li>
			<li
				:class="{
					active: activeStatus === 'FINISHED',
					'none-selected': activeStatus === undefined,
				}"
			>
				<a id="finishedArrow" href="#" @click="clickFooter('FINISHED')">
					<i class="fas fa-check" />
					<div class="icon-title">{{ $t("Finished") }}</div>
				</a>
			</li>
		</ul>
	</footer>
</template>

<script>

/************************** @DEPRECATED   see navbar-bottom.vue *********************** */



export default {
	name: "LiquidoFooter",
	props: {
		activeStatus: undefined
	},
	data() { return {} },
	methods: {
		/**
		 * When user clicks on a status, then this becomes the current activeStatus that we filte for.
		 * When user clicks on the active Status again, then the filter is cleared.
		 */
		clickFooter(newFilterValue) {
			this.$emit("setPollFilter", newFilterValue)
		},
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
	font-size: 1.7rem;
	border-top: 1px solid $primary; // rgba(0, 0, 255, 0.3);
	background-color: $header-bg;
}

$inactiveNavArrowBg: #fdfdff;
$arrowSize: 28px;

#navArrows {
	flex-wrap: nowrap;
	padding: 10px 10px;	
	text-align: center;
	//font-family: "Libre Baskerville", serif;
	transition: 0.5s;
	.icon-title {
		font-size: 12px;
		line-height: 1;
		text-decoration: none;
	}
}

#navArrows > li {
	margin: 0 $arrowSize * 0.5;
	position: relative;
	flex-grow: 1;
	flex-basis: 0; // make all li elemns the same width (independant of their content)
	transition: 0.5s;
	&:first-child {
		margin-left: 0;
	}
	&:last-child {
		margin-right: 0;
	}
}
#navArrows a {
	display: block;
	white-space: nowrap;
	overflow: hidden;
	//text-overflow: ellipsis;
	color: $header-bg;
	height: 2 * $arrowSize;
	line-height: 40px; // vertically center text in arrows
	background-color: $inactiveNavArrowBg;
	transition: 0.5s;
}
/* Wings before each element */
#navArrows li:not(:first-child) > a:before {
	position: absolute;
	content: "";
	top: 0px;
	left: -$arrowSize * 0.75;
	width: 0px;
	height: 0px;
	border-style: solid;
	border-width: $arrowSize 0 $arrowSize $arrowSize * 0.75;
	border-color: $inactiveNavArrowBg $inactiveNavArrowBg $inactiveNavArrowBg transparent;
	z-index: 150;
	transition: 0.5s;
}
/* Rounded corners for first element at the left */
#navArrows > li:first-child > a {
	border-top-left-radius: $arrowSize * 0.3;
	border-bottom-left-radius: $arrowSize * 0.3;
	transition: 0.5s;
}

/* Arrowhead after each element */
#navArrows > li:not(:last-child) > a:after {
	position: absolute;
	content: "";
	top: 0px;
	right: -$arrowSize * 0.75;
	width: 0px;
	height: 0px;
	border-style: solid;
	border-width: $arrowSize 0 $arrowSize $arrowSize * 0.75;
	border-color: transparent transparent transparent $inactiveNavArrowBg;
	z-index: 150;
	transition: 0.5s;
}
/* Rounded corners for last element at the right */
#navArrows > li:last-child > a {
	border-top-right-radius: $arrowSize * 0.3;
	border-bottom-right-radius: $arrowSize * 0.3;
	transition: 0.5s;
}

/* Navbar arrows when active */
#navArrows li.active a {
	color: white;
	background-color: $primary;
}
#navArrows li.active a:before {
	border-color: $primary $primary $primary transparent;
}
#navArrows li.active a:after {
	border-color: transparent transparent transparent $primary;
}
#navArrows li.none-selected a {
	color: $primary;
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
