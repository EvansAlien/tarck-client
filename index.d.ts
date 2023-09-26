interface TrackStatic {
	/**
	 * 向 metadata 据存储添加新的键值对, 如果键已经存在，则会更新它
	 *
	 * @param {String} key
	 * @param {String} value
	 */
	addMetadata(key: string, value: string): void;

	/**
	 * 在try/catch包装器中调用提供的函数，该包装器将错误转发给Track
	 *
	 * @param {Function} func 需要调用的函数
	 * @param {Object} context 内容
	 * @param {...} Additional arguments.
	 * @return {*} 输出这个函数
	 */
	attempt(func: Function, context?: any, ...args: any[]): any;

	/**
	 * 使用提供的配置配置Track实例
	 *
	 * @param {Object} options 这个 TrackJSConfigureOptions 配置对象
	 * @returns {Boolean} true表示配置成功
	 */
	configure(options: TrackConfigureOptions): boolean;

	/**
	 * 未公开的浏览器控制台日志记录, 使用此私有控制台可防止消息公开到标准浏览器控制台
	 */
	console: {
		/**
		 * 将上下文以正常级别记录到 Telemetry 日志中
		 *
		 * @param {...} args 序列化到 Telemetry 日志中的参数
		 */
		log(...args: any[]): void;

		/**
		 * 以DEBUG级别将上下文记录到 Telemetry 日志中
		 *
		 * @param {...} args
		 */
		debug(...args: any[]): void;

		/**
		 * 以INFO级别将上下文记录到 Telemetry 日志中
		 *
		 * @param {...} args
		 */
		info(...args: any[]): void;

		/**
		 * 以WARN级别将上下文记录到 Telemetry 日志中
		 *
		 * @param {...} args
		 */
		warn(...args: any[]): void;

		/**
		 * 以ERROR级别将上下文记录到 Telemetry 日志中, 如果启用了控制台错误，这是默认的，这也将传输一个错误
		 *
		 * @param {...} args
		 */
		error(...args: any[]): void;
	};

	/**
	 * 跟踪器脚本的运行版本
	 */
	hash: string;

	/**
	 * 安装到浏览器中
	 *
	 * @param options TrackJSInstallOptions 配置参数
	 */
	install(options: TrackInstallOptions): boolean;

	/**
	 * 代理是否已安装到当前环境中
	 *
	 * @returns {boolean}
	 */
	isInstalled(): boolean;

	/**
	 * 从 metaData 存储中删除键(如果存在)
	 *
	 * @param {String} key
	 */
	removeMetadata(key: string): void;

	/**
	 * 直接调用要发送到Track的错误
	 *
	 * @param {Error|Object|String} error 要跟踪的错误, 如果error没有堆栈跟踪，将尝试生成一个
	 */
	track(error: Error | Object | String): void;

	/**
	 * 跟踪器脚本的运行版本
	 */
	version: string;

	/**
	 * 返回函数的包装和监视版本，以自动捕获可能出现的任何错误
	 *
	 * @param {Function} func 监听的函数
	 * @param {Object} context 调用函数的上下文
	 * @return {Function} 包装的功能
	 */
	watch(func: Function, context?: any): Function;

	/**
	 * 包装并监视对象上的所有函数，这些函数将自动捕获可能出现的任何错误
	 *
	 * @param {Object} obj 包含要监视的函数的对象
	 * @return {Object} 对象现在包含包装函数
	 */
	watchAll(obj: Object): Object;
}

/**
 * 格式化为ISO-8601日期的字符串. 例子: 0000-00-00T00:00:00.000Z
 */
export interface ISO8601DateString extends String {}

/**
 * 发送到跟踪的错误, 在通过' onError '回调操作错误时非常有用
 */
export interface TrackErrorPayload {
	/** 异步回调绑定时的堆栈跟踪 */
	bindStack?: string;
	/** 异步回调绑定的时间戳 */
	bindTime?: ISO8601DateString;
	/** 浏览器控制台 Telemetry */
	console: {
		/** 事件发生的时间戳 */
		timestamp: ISO8601DateString;
		/** 事件的控制台严重性 */
		severity: string;
		/** 捕获的格式化消息 */
		message: string;
	}[];
	/** 用户会话提供的上下文信息 */
	customer: {
		/** 用户ID */
		application?: string;
		/** 描述当前页面视图的唯一Id */
		correlationId: string;
		/** 用户提供的访客会话ID */
		sessionId?: string;
		/** 用户token */
		token: string;
		/** 用户的访客用户ID */
		userId?: string;
		/** 用户提供的版本 */
		version?: string;
	};
	/** 如何捕获错误 */
	entry: string;
	/** 浏览器环境的相关信息 */
	environment: {
		/** 访问者在MS页面上停留了多长时间 */
		age: number;
		/** 在DOM上发现的其他JavaScript库 */
		dependencies: { [name: string]: string };
		/** 浏览器的 userAgent */
		userAgent: string;
		/** 当前窗口高度 */
		viewportHeight: number;
		/** 当前窗口宽度 */
		viewportWidth: number;
	};
	/** 自定义环境 metadata. */
	metadata: {
		/** 组名 */
		key: string;
		/** value */
		value: string;
	}[];
	/** 错误信息 */
	message: string;
	/** 浏览器 Navigation Telemetry */
	nav: {
		/** Navigation 事件的时间戳 */
		on: ISO8601DateString;
		/** Navigation 的方法类型. 处理IE "replaceState" "setState" */
		type: string;
		/** 前一页 */
		from: string;
		/** 当前页面 */
		to: string;
	}[];
	/** 网络 Telemetry */
	network: {
		/** 请求开始的时间戳 */
		startedOn: ISO8601DateString;
		/** 请求完成的时间戳 */
		completedOn: ISO8601DateString;
		/** HTTP 方法 */
		method: string;
		/** URL */
		url: string;
		/** HTTP Status Code */
		statusCode: number;
		/** HTTP Status Text */
		statusText: string;
		/** 兼容方法. IE "fetch", "xhr" */
		type: string;
	}[];
	/** 发生错误时浏览器的路径 */
	url: string;
	/** 堆栈 */
	stack: string;
	/** 客户端报告错误发生的时间 */
	timestamp: ISO8601DateString;
	/** 行为事件 Telemetry */
	visitor: {
		/** 事件发生的时间戳 */
		timestamp: ISO8601DateString;
		/** 行为事件. "input" or "click" */
		action: string;
		/** 作用的DOM元素 */
		element: {
			/** 元素标签. IE "input" */
			tag: string;
			/** 元素 attributes 的哈希映射 */
			attributes: { [attributeName: string]: string };
			/** 元素的值 */
			value: {
				/** 长度 */
				length: number;
				/** 内容行为 */
				pattern: string;
			};
		};
	}[];
	/** Track版本 */
	version: string;
	/** 客户端节流的消息数 */
	throttled: number;
}

/**
 * 可以传递给' Track.configure() '的配置选项
 */
export interface TrackConfigureOptions {
	/**
	 * 是否在发送前抑制重复错误
	 * @default true
	 */
	dedupe?: boolean;

	/**
	 * 是否尝试在页面上发现其他JavaScript库的依赖
	 * @default true
	 */
	dependencies?: boolean;

	/**
	 * 在发送错误之前通知自定义处理程序, 可用于修改或忽略错误数据
	 *
	 * @param {TrackJSErrorPayload} payload
	 * @param {Error} error 启动捕获的错误对象
	 */
	onError?: (payload: TrackErrorPayload, error?: Error) => boolean;

	/**
	 * 序列化错误和遥测中的非字符串数据的自定义处理程序事件
	 */
	serialize?: (what: any) => string;

	/**
	 * 会客使用它将跟踪错误报告与其他报告数据关联起来
	 */
	sessionId?: string;

	/**
	 * id
	 */
	userId?: string;

	/**
	 * 一个版本号
	 */
	version?: string;
}

/**
 * 从' window._trackJs '初始化的配置选项
 */
export interface TrackInstallOptions extends TrackConfigureOptions {
	/**
	 * 跟踪令牌
	 */
	application?: string;

	callback?: {
		/**
		 * 当从回调函数捕获错误时是否应该记录
		 * @default true
		 */
		enabled?: boolean;
		/**
		 * 是否应该在调用异步操作时生成堆栈跟踪。这将产生类似于Chrome Developer工具中的“async”跟踪的堆栈跟踪
		 * 启用此功能会对性能产生影响。在发布之前确认应用程序中的行为
		 * default false.
		 */
		bindStack?: boolean;
	};

	console?: {
		/**
		 * 是否应该从控制台记录事件
		 * @default true
		 */
		enabled?: boolean;
		/**
		 * 控制台消息是应该传递到浏览器控制台还是由 Track 隐藏, 用于从生产中删除调试消息
		 * @default true
		 */
		display?: boolean;
		/**
		 * 是否应该通过调用 `console.error` 来记录警告。
		 * @default true
		 */
		error?: boolean;
		/**
		 *是否应该通过调用 `console.warn` 来记录警告。
		 * @default false
		 */
		warn?: boolean;
		/**
		 * 通过在这里将控制台功能列入白名单来限制要观看的功能
		 * @default ["log","debug","info","warn","error"]
		 */
		watch?: string[];
	};

	/**
	 * 是否启用跟踪器脚本
	 * @default true
	 */
	enabled?: boolean;

	/**
	 * 限制的域名发送
	 */
	forwardingDomain?: string;

	network?: {
		/**
		 * 是否从network记录事件
		 * @default true
		 */
		enabled?: boolean;
		/**
		 * XHR响应是否应该用状态码记录错误 400
		 * @default true
		 */
		error?: boolean;
	};

	/**
	 * account token.
	 */
	token: string;

	visitor?: {
		/**
		 * 是否应该记录访问者行为的事件
		 * @default true
		 */
		enabled?: boolean;
	};

	window?: {
		/**
		 * 是否应该从全局未处理的错误记录事件
		 * @default true
		 */
		enabled?: boolean;
		/**
		 * 是否全局处理 promise 的错误记录
		 * @default true
		 */
		promise?: boolean;
	};
}

declare global {
	var Track: TrackStatic | undefined;
	interface Window {
		Track: TrackStatic | undefined;
	}
}

declare var Track: TrackStatic;
export { Track };
