<template>
	<!-- Mobile Debug Log - Expand by clicking on the "L"-Ribbon at the bottom -->
	<div class="mobile-debug-log" :class="{'collapsed': collapsed}">
		<div class="mobile-debug-icon" @click="collapsed = !collapsed">&Laplacetrf;</div>
		<div class="log-header">
			<div class="line-break" :class="{'active-button': lineBreak}" @click="lineBreak = !lineBreak">brk</div>
			<div class="show-all-cols" @click="showAllCols">cols</div>
			<div class="filter">
				<input v-model="filterStr" type="text" class="filter-input" placeholder="Filter" />
			</div>
			<div class="clear-log" @click="clearLog">cls</div>
			<div class="show-last-row" :class="{'active-button': showLastRow}" @click="toggleShowLastRow">end</div>
		</div>
		<div id="log-entries-table-wrapper">
			<table class="log-entries-table">
				<thead>
					<td 
						v-for="col in shownColumns" 
						:key="col.key" 
						:class="getHeaderClass(col)" 
						:style="getHeaderStyle(col)"
						@click="clickHeader(col)"
					>
						{{ col.name }}
					</td>
				</thead>
				<tr v-for="(entry, idx) in filteredEntries" :key="entry.key" :class="getRowClass(entry, idx)">
					<td v-for="col in shownColumns" :key="col.key" :class="getCellClass(col, entry)">
						<span class="log-cell">{{ getColValue(col, entry) }}</span>
					</td>
				</tr>
				<tr v-if="filteredEntries.length === 0">
					<td :colspan="shownColumns.length" class="empty-log">
						&bemptyv;
					</td>
				</tr>
			</table>
		</div>
	</div>
</template>

<script>
/**
 * Vue MobileDebugLog
 * 
 * This vue component can be used to show debug log entries on a mobile phone
 * where you do not have direct access to the browser's console.
 * 
 * <b>This module re-routes your console.log statements!</b>
 * Logs will still also be sent to the browser's console. And they will be shown in the drawer.
 *
 * Tap the small ribbon at the bottom of the screen to open the console drawer.
 */

// Maximum number of log lines to keep
const MAX_LOG_ENTRIES = 999
const MAX_MESSAGE_LEN = 200

/* eslint-disable no-unused-vars */
const SILENT = 999
const ERROR = 4
const WARN  = 3
const INFO  = 2
const DEBUG = 1
const TRACE = 0
const ALL = -1

const LEVEL_NAME = ["TRACE", "DEBUG", "INFO", "WARN", "ERROR"]

/** Can catch all console.log() calls. But then you loose the caller information in the browser console */
const REDEFINE_CONSOLE_FUNCS = true

let errorFunc = console.error
let warnFunc = console.warn
let infoFunc = console.info
let logFunc = console.log
let debugFunc = console.debug
let traceFunc = console.trace

export default {
	name: "MobileDebugLog",
	data() {
		return {
			// all entries in the log. Will be truncated to MAX_LOG_ENTRIES
			logEntries: [],

			// log messages below this level will not shown (by default, show all)
			logLevel: ALL,

			// Log view can be expanded and collapsed
			collapsed: true,

			// IDs for each log entry
			idSequence: 0,

			// when logging was started. Delta is shown in timestamp col
			startTime: 0,

			// currently active filter (log message includes)
			filterStr: "",

			// always show the last row of the log
			showLastRow: true,

			// break long messages
			lineBreak: false,

			// show every second line with an alternate color. (see getRowClass)
			alternatingRows: true,

			// Columns in the log. Each columns has a FIXED with, except the last one!
			// This is the only way to not let the table overflow its wrapper DIV.
			columns: [
				{ key: "timestamp", name: "ms", width: "40px", show: true },
				{ key: "level", name: "lvl", width: "40px", show: true },
				{ key: "message", name: "msg", width: undefined, show: true }
			]
		}
	},
	computed: {
		shownColumns() {
			return this.columns.filter(col => col.show)
		},
		filteredEntries() {
			if (!this.filterStr) return this.logEntries
			return this.logEntries.filter(entry => {
				let str = this.toString(entry.message)
				return str.includes(this.filterStr)
			})
		}
	},
	watch: {
		"logEntries": function() {
			if (this.showLastRow) {
				this.scrollToBottom()
			}
		},
	},
	created() {
		this.startTime = Date.now()

		// Here we redefine console.log/debug/trace/info functions.  
		// Be carefull that no one else is also doing this, e.g. logLevel does this: https://github.com/pimterry/loglevel/issues/129
		// AND you loose the information which module logged the message. Everything will come from mobile-debug-log.vue
		// Better call the info/debug/log/error methods below directly.
		if (REDEFINE_CONSOLE_FUNCS) {
			console.error = this.error
			console.warn = this.warn
			console.info = this.info
			console.log  = this.log
			console.debug = this.debug
			console.trace = this.trace
		}

	},
	mounted() {
		console.debug("VUE mobile-debug-log mounted.")
	},
	methods: {
		log(...args) {
			logFunc(...args)
			this.logAtLevel(INFO, args)
		},
		error(...args) {
			errorFunc(...args)
			this.logAtLevel(ERROR, args)
		},
		warn(...args) {
			warnFunc(...args)
			this.logAtLevel(WARN, args)
		},
		info(...args) {
			infoFunc(...args)
			this.logAtLevel(INFO, args)
		},
		debug(...args) {
			debugFunc(...args)
			this.logAtLevel(DEBUG, args)
		},
		trace(...args) {
			traceFunc(...args)
			this.logAtLevel(TRACE, args)
		},

		/** 
		 * Create a log message.
		 * The message will be shown in our mobile-debug-log drawer AND
		 * in the normal browser console.
		 */
		logAtLevel(level, args) {
			//if (level < this.logLevel) return
			this.logEntries.push({
				id: this.idSequence++,
				timestamp: Date.now() - this.startTime,
				level: level,
				message: args
			})
			if (this.logEntries.length > MAX_LOG_ENTRIES) {
				this.logEntries.shift()
			}
		},

		/** get display value for entry in col */
		getColValue(col, entry) {
			switch (col.key) {
				case "timestamp": return entry.timestamp;
				case "level": return entry.level <= ERROR ? LEVEL_NAME[entry.level] : entry.level;
				case "message": return this.toString(entry.message)
				default:
					return ""
			}
		},

		/** 
		 * Convert valto a string in the same way as the browser does. 
		 * Truncate result to MAX_MESSAGE_LEN
		 */
		toString(val) {
			let str = val
			if (Array.isArray(val)) {
				str = val.map(v => typeof v === "object" ? JSON.stringify(v) : v).join(" ")	
			}
			if (str.length > MAX_MESSAGE_LEN) str = str.substr(0, MAX_MESSAGE_LEN)+" ..."
			return str
		},


		clickHeader(col) {
			if (col.key === "timestamp" || col.key === "level") col.show = !col.show
		},

		showAllCols() {
			this.columns.forEach(col => col.show = true)
		},

		clearLog() {
			this.logEntries = []
		},

		toggleShowLastRow() {
			this.showLastRow = !this.showLastRow
			if (this.showLastRow) this.scrollToBottom()
		},		

		/** this is automatically called when showLastRow is active */
		scrollToBottom() {
			this.$nextTick(() => {
				$("#log-entries-table-wrapper").animate({
					scrollTop: $("#log-entries-table-wrapper")[0].scrollHeight
				}, 500)
			})
		},
		
		/** Utility methods for layout */

		getHeaderClass(col) {
			return col.key
		},

		getHeaderStyle(col) {
			return col.width ? "width: "+col.width : ""
		},

		getRowClass(entry, idx) {
			let res = entry.level <= ERROR ? LEVEL_NAME[entry.level] : entry.level
			if (this.alternatingRows && (idx % 2 === 0)) res += " alternate-row"
			return res
		},

		/* eslint-disable no-unused-vars */
		getCellClass(col, entry) {
			if (col.key === "message") {
				return col.key + " " + (this.lineBreak ? "line-break" : "no-wrap")
			} else { 
				return col.key
			}
		},
	},
}
</script>

<style lang="scss">
	.mobile-debug-log {
		z-index: 10000;
		display: flex;
		flex-direction: column;
		position: fixed;
		height: 80%;
		bottom: 0;
		color: white;
		background-color: black;
		transition: height 0.5s ease-in-out;
		box-shadow: 0px -3px 5px rgba(0,0,0,0.5);
		font-size: 12px;
		//font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
		font-family: monospace;

		.mobile-debug-icon {
			position: absolute;
			top: -30px;
			left: calc(50% - 30px);
			width: 50px;
			height: 30px;
			color: black;
			background: #AAA;
			font-size: 25px;
			line-height: 30px;
			font-family: "Georgia", "Apple Symbols", serif;
			text-align: center;
			mix-blend-mode: difference;
			border-top-left-radius: 8px;
			border-top-right-radius: 8px;
			border-top: 1px solid rgba(0,0,0,0.5);
			border-left: 1px solid rgba(0,0,0,0.5);
			border-right: 1px solid rgba(0,0,0,0.5);
			box-shadow: 3px 3px 5px rgba(0,0,0,0.5);
		}

		.log-header {
			color: white;
			background-color: darkgrey;
			font-size: 14px;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			padding: 5px 10px;
		}

		.filter-input {
			display: block;
			padding: 0 0 0 0.25rem;
			margin: 0;
			background-color: #fff;
			background-clip: padding-box;
			border: none;
			border-radius: .25rem;
		}

		.active-button {
			color: green;
			font-weight: bold;
		}

		#log-entries-table-wrapper {
			overflow-x: hidden;
			overflow-y: scroll;
			width: 100%;
			flex-grow: 1;
		}

		.empty-log {
			text-align: center;
			color: lightgrey;
			font-size: 20px;
			padding-top: 20px;
		}

		.log-entries-table {
			table-layout: fixed;
			width: 100%;
			margin-bottom: 20px;
			font-family: monospace;
			border-top: 1px solid black;
			thead {
				color: #666;
				background-color: lightgrey;
				font-weight: bold;
				font-size: 12px;
				td {
					text-align: center;
					padding: 2px 1px; 
				}
				td:not(:last-child) {
					border-right: 1px solid black;
				}
			}
			tr {
				/** pretty condensed. We want to show as much info as possible */
				line-height: 1.1;
			}
		}

		// format of columns
		.timestamp {
			text-align: right;
			overflow-x: hidden;
		}

		.alternate-row {
			background-color: #222;
		}
	}

	.mobile-debug-log.collapsed {
		height: 0;
		//top: 100%;
		box-shadow: none;
		.mobile-debug-icon {
			bottom: 0;
		}
	}


	.line-break {
		white-space: normal;
		padding-left: 1em;
    text-indent: -1em;
	}

	.no-wrap {
		white-space: nowrap;
		overflow-x: hidden;
		text-overflow: ellipsis;
	}

	tr.ERROR {
		color: red;
	}
	tr.INFO .level {
		color: lightskyblue;
	}
	tr.WARN .level {
		color: darkgoldenrod;
	}
	tr.DEBUG .level{
		color: lightgray;
	}
	tr.TRACE {
		color: grey;
	}
</style>
