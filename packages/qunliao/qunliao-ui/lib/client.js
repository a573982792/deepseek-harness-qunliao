window.__ModuleLoader__.load({
	id: "@deepseek-ai/dsh-client-qunliao-ui",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		let _deepseek_ai_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
		let react_jsx_runtime = require("react/jsx-runtime");
		//#region \0dsh-css:C:\Users\明\Documents\Codex\2026-08-18\ban\work\harness\packages\qunliao\qunliao-ui\src\client\MemberMessage.module.css.mjs
		const css$4 = "._4g-MZW_row{gap:8px;max-width:min(736px,100%);padding:6px 0;display:flex}._4g-MZW_avatar{background:var(--dsw-alias-interactive-bg-hover);user-select:none;border-radius:10px;flex:none;justify-content:center;align-items:center;width:32px;height:32px;font-size:17px;display:flex}._4g-MZW_stack{flex:1;min-width:0}._4g-MZW_meta{align-items:baseline;gap:8px;margin-bottom:3px;display:flex}._4g-MZW_name{color:var(--dsw-alias-label-secondary);font-size:14px;font-weight:600}._4g-MZW_turn{color:var(--dsw-alias-label-tertiary);font-size:12px}._4g-MZW_bubble{background:var(--dsw-alias-interactive-bg-hover);max-width:100%;color:var(--dsw-alias-label-primary);white-space:pre-wrap;word-break:break-word;border-radius:16px 16px 16px 6px;padding:10px 16px;font-size:16px;line-height:28px;display:inline-block}._4g-MZW_systemRow{justify-content:center;padding:8px 0;display:flex}._4g-MZW_systemBubble{background:var(--dsw-alias-interactive-bg-hover);max-width:80%;color:var(--dsw-alias-label-tertiary);text-align:center;border-radius:999px;padding:6px 12px;font-size:12px}";
		const tagId$4 = "@deepseek-ai/dsh-client-qunliao-ui/MemberMessage.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$4) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@deepseek-ai/dsh-client-qunliao-ui";
			tag.dataset.pluginCss = tagId$4;
			tag.textContent = css$4;
			document.head.appendChild(tag);
		}
		var MemberMessage_module_css_default = {
			"stack": "_4g-MZW_stack",
			"systemRow": "_4g-MZW_systemRow",
			"name": "_4g-MZW_name",
			"row": "_4g-MZW_row",
			"systemBubble": "_4g-MZW_systemBubble",
			"meta": "_4g-MZW_meta",
			"bubble": "_4g-MZW_bubble",
			"turn": "_4g-MZW_turn",
			"avatar": "_4g-MZW_avatar"
		};
		//#endregion
		//#region src/client/MemberMessage.tsx
		/** 群聊成员发言气泡：头像、名字与正文。 */
		/** 渲染一位群成员的发言。系统消息（speakerId === 'system'）居中显示为提示条。 */
		const MemberMessage = (0, react.memo)(function MemberMessage({ node }) {
			const data = node.data;
			if (data.speakerId === "system") return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: MemberMessage_module_css_default.systemRow,
				"data-qunliao-system": "",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: MemberMessage_module_css_default.systemBubble,
					children: data.text
				})
			});
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: MemberMessage_module_css_default.row,
				"data-qunliao-member": "",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: MemberMessage_module_css_default.avatar,
					"aria-hidden": "true",
					children: data.emoji ?? "🤖"
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: MemberMessage_module_css_default.stack,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: MemberMessage_module_css_default.meta,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: MemberMessage_module_css_default.name,
							children: data.speakerName
						}), data.turn > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
							className: MemberMessage_module_css_default.turn,
							children: [
								"第 ",
								data.turn,
								" 轮"
							]
						})]
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: MemberMessage_module_css_default.bubble,
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.MessageText, { text: data.text })
					})]
				})]
			});
		});
		//#endregion
		//#region \0dsh-css:C:\Users\明\Documents\Codex\2026-08-18\ban\work\harness\packages\qunliao\qunliao-ui\src\client\GroupToggleButton.module.css.mjs
		const css$3 = ".knAWfa_button{flex:none}.knAWfa_lit{color:var(--dsw-alias-button-info-fill)}.knAWfa_label{white-space:nowrap}";
		const tagId$3 = "@deepseek-ai/dsh-client-qunliao-ui/GroupToggleButton.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$3) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@deepseek-ai/dsh-client-qunliao-ui";
			tag.dataset.pluginCss = tagId$3;
			tag.textContent = css$3;
			document.head.appendChild(tag);
		}
		var GroupToggleButton_module_css_default = {
			"lit": "knAWfa_lit",
			"button": "knAWfa_button",
			"label": "knAWfa_label"
		};
		//#endregion
		//#region src/client/GroupToggleButton.tsx
		/** 群聊讨论开关：会话头部按钮，点击开启成员讨论；打断交由发送键。 */
		/** 从会话的隐藏状态节点推导开关与运行标记。 */
		function stateNodesOf(nodes) {
			let isGroup = false;
			let toggleOn = false;
			let running = false;
			for (const node of nodes) if (node.kind === "qunliao-setup") {
				isGroup = true;
				node.data;
			} else if (node.kind === "qunliao-state") {
				const data = node.data;
				toggleOn = data.toggleOn;
				running = data.running;
			}
			return {
				isGroup,
				toggleOn,
				running
			};
		}
		/** 渲染讨论开关按钮；非群聊会话返回空。点一下开启，再点一下关闭/打断。 */
		const GroupToggleButton = (0, react.memo)(function GroupToggleButton({ useSession, toggle, t }) {
			const { isGroup, toggleOn, running } = stateNodesOf(useSession((state) => state.chat.nodes.values()));
			const [busy, setBusy] = (0, react.useState)(false);
			if (!isGroup) return null;
			const active = toggleOn || running;
			const label = active ? t("toggle.on") : t("toggle.off");
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
				className: GroupToggleButton_module_css_default.button,
				variant: "toolbar",
				size: "sm",
				icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconSparkle16, { className: active ? GroupToggleButton_module_css_default.lit : void 0 }),
				title: t("toggle.tooltip"),
				disabled: busy,
				onClick: () => {
					setBusy(true);
					toggle(!active).finally(() => {
						setBusy(false);
					});
				},
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: GroupToggleButton_module_css_default.label,
					children: label
				})
			});
		});
		//#endregion
		//#region \0dsh-css:C:\Users\明\Documents\Codex\2026-08-18\ban\work\harness\packages\qunliao\qunliao-ui\src\client\GroupManageButton.module.css.mjs
		const css$2 = "._09AJca_button{flex:none}._09AJca_label{white-space:nowrap}._09AJca_body{flex-direction:column;gap:14px;max-height:60vh;display:flex;overflow-y:auto}._09AJca_sectionLabel{color:var(--dsw-alias-label-secondary);font-size:13px}._09AJca_membersList{flex-direction:column;gap:8px;display:flex}._09AJca_members{flex-direction:column;gap:6px;display:flex}._09AJca_memberRow{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-interactive-bg-hover);border-radius:10px;align-items:center;gap:8px;padding:8px 10px;display:flex}._09AJca_memberEmoji{background:var(--dsw-alias-interactive-bg-hover);border-radius:6px;flex:none;justify-content:center;align-items:center;width:24px;height:24px;font-size:14px;display:inline-flex}._09AJca_memberName{color:var(--dsw-alias-label-primary);flex:none;font-size:14px;font-weight:600}._09AJca_memberMeta{min-width:0;color:var(--dsw-alias-label-secondary);text-overflow:ellipsis;white-space:nowrap;flex:1;font-size:12px;overflow:hidden}._09AJca_memberModel{color:var(--dsw-alias-label-tertiary);flex:none;font-size:11px}._09AJca_muteHint{color:var(--dsw-alias-label-tertiary);margin-left:8px;font-size:11px;font-weight:400}._09AJca_muteButton,._09AJca_muteButtonOn{cursor:pointer;background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-secondary);border:none;border-radius:6px;flex:none;padding:3px 8px;font-size:12px}._09AJca_muteButton:hover{background:var(--dsw-alias-button-floating-hover);color:var(--dsw-alias-label-primary)}._09AJca_muteButtonOn{background:var(--dsw-alias-state-warn-tertiary);color:var(--dsw-alias-state-warn-primary)}._09AJca_muteButtonOn:hover{opacity:.85}._09AJca_mutedTag{background:var(--dsw-alias-state-warn-tertiary);color:var(--dsw-alias-state-warn-primary);border-radius:4px;margin-left:6px;padding:1px 6px;font-size:10px;font-weight:500}._09AJca_divider{background:var(--dsw-alias-border-l2);height:1px}._09AJca_draft{flex-direction:column;gap:8px;display:flex}._09AJca_field{flex-direction:column;gap:4px;min-width:0;display:flex}._09AJca_label{color:var(--dsw-alias-label-secondary);font-size:13px}._09AJca_grid{grid-template-columns:1fr 1fr;gap:10px;display:grid}._09AJca_select{border:1px solid var(--dsw-alias-border-l3);background:var(--dsw-specific-input-major);width:100%;color:var(--dsw-alias-label-primary);font:inherit;border-radius:8px;padding:8px 10px;font-size:14px}._09AJca_footer{justify-content:flex-end;align-items:center;gap:10px;width:100%;display:flex}._09AJca_error{color:var(--dsw-alias-state-error-primary);text-align:left;flex:1;font-size:12px}._09AJca_notice{color:var(--dsw-alias-state-success-primary);text-align:left;flex:1;font-size:12px}";
		const tagId$2 = "@deepseek-ai/dsh-client-qunliao-ui/GroupManageButton.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$2) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@deepseek-ai/dsh-client-qunliao-ui";
			tag.dataset.pluginCss = tagId$2;
			tag.textContent = css$2;
			document.head.appendChild(tag);
		}
		var GroupManageButton_module_css_default = {
			"memberModel": "_09AJca_memberModel",
			"membersList": "_09AJca_membersList",
			"mutedTag": "_09AJca_mutedTag",
			"memberName": "_09AJca_memberName",
			"memberEmoji": "_09AJca_memberEmoji",
			"field": "_09AJca_field",
			"memberRow": "_09AJca_memberRow",
			"grid": "_09AJca_grid",
			"members": "_09AJca_members",
			"select": "_09AJca_select",
			"sectionLabel": "_09AJca_sectionLabel",
			"button": "_09AJca_button",
			"muteButtonOn": "_09AJca_muteButtonOn",
			"memberMeta": "_09AJca_memberMeta",
			"label": "_09AJca_label",
			"error": "_09AJca_error",
			"body": "_09AJca_body",
			"footer": "_09AJca_footer",
			"notice": "_09AJca_notice",
			"muteButton": "_09AJca_muteButton",
			"divider": "_09AJca_divider",
			"draft": "_09AJca_draft",
			"muteHint": "_09AJca_muteHint"
		};
		//#endregion
		//#region src/client/GroupManageButton.tsx
		/** 群管理按钮组：查看成员并添加新成员 + 修改讨论轮数。 */
		/** 从会话节点读取最新建群快照。 */
		function setupOf(nodes) {
			let setup;
			for (const node of nodes) if (node.kind === "qunliao-setup") setup = node.data;
			return setup;
		}
		/** 会话头部：成员管理 + 轮数按钮；非群聊会话返回空。 */
		const GroupManageButton = (0, react.memo)(function GroupManageButton({ useSession, addMember, setRounds, setMuted, api, sessionId, t }) {
			const setup = setupOf(useSession((state) => state.chat.nodes.values()));
			const [memberOpen, setMemberOpen] = (0, react.useState)(false);
			const [roundsOpen, setRoundsOpen] = (0, react.useState)(false);
			const [draft, setDraft] = (0, react.useState)({
				name: "",
				identity: "",
				emoji: "",
				provider: "",
				model: ""
			});
			const [roundsText, setRoundsText] = (0, react.useState)("");
			const [providers, setProviders] = (0, react.useState)([]);
			const [modelsStatus, setModelsStatus] = (0, react.useState)("loading");
			const [busy, setBusy] = (0, react.useState)(false);
			const [error, setError] = (0, react.useState)(null);
			const [notice, setNotice] = (0, react.useState)(null);
			(0, react.useEffect)(() => {
				if (!memberOpen) return;
				setModelsStatus("loading");
				api.sessions.models({ sessionId }).then(({ result }) => {
					if (!result.ok) {
						setModelsStatus("error");
						return;
					}
					setProviders(result.value.groups);
					setModelsStatus("ready");
				}, () => {
					setModelsStatus("error");
				});
			}, [memberOpen, api]);
			(0, react.useEffect)(() => {
				if (roundsOpen && setup !== void 0) setRoundsText(String(setup.rounds ?? 3));
			}, [roundsOpen, setup]);
			if (setup === void 0) return null;
			const members = setup.members;
			const openMember = () => {
				setDraft({
					name: "",
					identity: "",
					emoji: "",
					provider: "",
					model: ""
				});
				setError(null);
				setNotice(null);
				setMemberOpen(true);
			};
			const submitMember = async () => {
				const name = draft.name.trim();
				if (name.length === 0 || draft.identity.trim().length === 0 || draft.provider.trim().length === 0 || draft.model.trim().length === 0) {
					setError(t("manage.error.missing"));
					return;
				}
				if (members.some((member) => member.name === name)) {
					setError(t("manage.error.duplicate"));
					return;
				}
				setBusy(true);
				setError(null);
				setNotice(null);
				try {
					setNotice(await addMember({
						name,
						identity: draft.identity.trim(),
						...draft.emoji.trim().length > 0 ? { emoji: draft.emoji.trim() } : {},
						provider: draft.provider.trim(),
						model: draft.model.trim()
					}));
					setDraft({
						name: "",
						identity: "",
						emoji: "",
						provider: "",
						model: ""
					});
				} catch (reason) {
					setError(t("manage.error.command", { message: reason instanceof Error ? reason.message : String(reason) }));
				} finally {
					setBusy(false);
				}
			};
			const submitRounds = async () => {
				const value = Number(roundsText);
				if (!Number.isInteger(value) || value < 1 || value > 10) {
					setError(t("manage.error.invalidRounds"));
					return;
				}
				setBusy(true);
				setError(null);
				setNotice(null);
				try {
					setNotice(await setRounds(value));
				} catch (reason) {
					setError(t("manage.error.command", { message: reason instanceof Error ? reason.message : String(reason) }));
				} finally {
					setBusy(false);
				}
			};
			const providerOptions = providers.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
				value: "",
				children: modelsStatus === "loading" ? t("modal.loadingModels") : t("modal.loadModelsFailed")
			}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("option", {
				value: "",
				children: [t("modal.provider"), "…"]
			}), providers.map((group) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
				value: group.id,
				children: group.name
			}, group.id))] });
			const modelsOf = (provider) => providers.find((group) => group.id === provider)?.models ?? [];
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
					className: GroupManageButton_module_css_default.button,
					variant: "toolbar",
					size: "sm",
					icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconUserOutline16, { size: 14 }),
					title: t("manage.addMemberTitle"),
					onClick: openMember,
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: GroupManageButton_module_css_default.label,
						children: t("manage.members")
					})
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
					className: GroupManageButton_module_css_default.button,
					variant: "toolbar",
					size: "sm",
					title: t("manage.roundsTitle"),
					onClick: () => {
						setError(null);
						setNotice(null);
						setRoundsOpen(true);
					},
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: GroupManageButton_module_css_default.label,
						children: t("manage.roundsButton", { n: setup.rounds ?? 3 })
					})
				}),
				memberOpen && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Modal, {
					open: true,
					onClose: busy ? () => void 0 : () => {
						setMemberOpen(false);
					},
					title: t("manage.addMemberTitle"),
					closeLabel: t("modal.cancel"),
					description: t("manage.addMemberHint"),
					footer: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: GroupManageButton_module_css_default.footer,
						children: [
							error !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: GroupManageButton_module_css_default.error,
								children: error
							}),
							notice !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: GroupManageButton_module_css_default.notice,
								children: notice
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
								variant: "ghost",
								size: "sm",
								disabled: busy,
								onClick: () => {
									setMemberOpen(false);
								},
								children: t("modal.cancel")
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
								variant: "primary",
								size: "sm",
								disabled: busy,
								onClick: () => {
									submitMember();
								},
								children: busy ? t("manage.busy") : t("manage.addMember")
							})
						]
					}),
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: GroupManageButton_module_css_default.body,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: GroupManageButton_module_css_default.membersList,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
									className: GroupManageButton_module_css_default.sectionLabel,
									children: [
										t("manage.members"),
										t("manage.memberCount", { n: members.length }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: GroupManageButton_module_css_default.muteHint,
											children: t("manage.muteHint")
										})
									]
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: GroupManageButton_module_css_default.members,
									children: members.map((member) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: GroupManageButton_module_css_default.memberRow,
										children: [
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
												className: GroupManageButton_module_css_default.memberEmoji,
												"aria-hidden": "true",
												children: member.emoji ?? "🤖"
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
												className: GroupManageButton_module_css_default.memberName,
												children: [member.name, member.muted === true && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
													className: GroupManageButton_module_css_default.mutedTag,
													children: t("manage.mutedTag")
												})]
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
												className: GroupManageButton_module_css_default.memberMeta,
												children: member.identity
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
												className: GroupManageButton_module_css_default.memberModel,
												children: member.model
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
												type: "button",
												className: member.muted === true ? GroupManageButton_module_css_default.muteButtonOn : GroupManageButton_module_css_default.muteButton,
												disabled: busy,
												onClick: () => {
													setMuted(member.id, member.muted !== true).then((message) => {
														setNotice(message);
													}).catch((reason) => {
														setError(t("manage.error.command", { message: reason instanceof Error ? reason.message : String(reason) }));
													});
												},
												children: member.muted === true ? t("manage.unmute") : t("manage.mute")
											})
										]
									}, member.id))
								})]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", { className: GroupManageButton_module_css_default.divider }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: GroupManageButton_module_css_default.draft,
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: GroupManageButton_module_css_default.grid,
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
											className: GroupManageButton_module_css_default.field,
											children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
												className: GroupManageButton_module_css_default.label,
												children: t("modal.memberName")
											}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Input, {
												value: draft.name,
												placeholder: t("modal.memberNamePlaceholder"),
												onChange: (event) => {
													setDraft((current) => ({
														...current,
														name: event.target.value
													}));
												}
											})]
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
											className: GroupManageButton_module_css_default.field,
											children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
												className: GroupManageButton_module_css_default.label,
												children: t("modal.emoji")
											}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Input, {
												value: draft.emoji,
												placeholder: t("modal.emojiPlaceholder"),
												onChange: (event) => {
													setDraft((current) => ({
														...current,
														emoji: event.target.value
													}));
												}
											})]
										})]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
										className: GroupManageButton_module_css_default.field,
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: GroupManageButton_module_css_default.label,
											children: t("modal.identity")
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Input, {
											value: draft.identity,
											placeholder: t("modal.identityPlaceholder"),
											onChange: (event) => {
												setDraft((current) => ({
													...current,
													identity: event.target.value
												}));
											}
										})]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: GroupManageButton_module_css_default.grid,
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
											className: GroupManageButton_module_css_default.field,
											children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
												className: GroupManageButton_module_css_default.label,
												children: t("modal.provider")
											}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("select", {
												className: GroupManageButton_module_css_default.select,
												value: draft.provider,
												disabled: modelsStatus !== "ready",
												onChange: (event) => {
													setDraft((current) => ({
														...current,
														provider: event.target.value,
														model: ""
													}));
												},
												children: providerOptions
											})]
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
											className: GroupManageButton_module_css_default.field,
											children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
												className: GroupManageButton_module_css_default.label,
												children: t("modal.model")
											}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("select", {
												className: GroupManageButton_module_css_default.select,
												value: draft.model,
												disabled: modelsStatus !== "ready" || draft.provider.length === 0,
												onChange: (event) => {
													setDraft((current) => ({
														...current,
														model: event.target.value
													}));
												},
												children: draft.provider.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("option", {
													value: "",
													children: [t("modal.provider"), "…"]
												}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("option", {
													value: "",
													children: [t("modal.model"), "…"]
												}), modelsOf(draft.provider).map((model) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
													value: model.id,
													children: model.name
												}, model.id))] })
											})]
										})]
									})
								]
							})
						]
					})
				}),
				roundsOpen && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Modal, {
					open: true,
					onClose: busy ? () => void 0 : () => {
						setRoundsOpen(false);
					},
					title: t("manage.roundsTitle"),
					closeLabel: t("modal.cancel"),
					description: t("manage.roundsHint"),
					footer: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: GroupManageButton_module_css_default.footer,
						children: [
							error !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: GroupManageButton_module_css_default.error,
								children: error
							}),
							notice !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: GroupManageButton_module_css_default.notice,
								children: notice
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
								variant: "ghost",
								size: "sm",
								disabled: busy,
								onClick: () => {
									setRoundsOpen(false);
								},
								children: t("modal.cancel")
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
								variant: "primary",
								size: "sm",
								disabled: busy,
								onClick: () => {
									submitRounds();
								},
								children: busy ? t("manage.busy") : t("manage.save")
							})
						]
					}),
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: GroupManageButton_module_css_default.body,
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
							className: GroupManageButton_module_css_default.field,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: GroupManageButton_module_css_default.label,
								children: t("manage.rounds")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Input, {
								value: roundsText,
								placeholder: "3",
								inputMode: "numeric",
								onChange: (event) => {
									setRoundsText(event.target.value.replace(/[^0-9]/g, ""));
								}
							})]
						})
					})
				})
			] });
		});
		//#endregion
		//#region \0dsh-css:C:\Users\明\Documents\Codex\2026-08-18\ban\work\harness\packages\qunliao\qunliao-ui\src\client\GroupComposer.module.css.mjs
		const css$1 = "._7lJCRW_root{box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2-darkmode-thin);background:var(--dsw-specific-input-major);box-shadow:var(--dsw-shadow-lv2);border-radius:22px;flex-direction:column;gap:12px;padding:12px;display:flex;position:relative}._7lJCRW_input{resize:vertical;width:100%;min-height:72px;color:var(--dsw-alias-label-primary);font:inherit;background:0 0;border:none;outline:none;font-size:16px;line-height:24px}._7lJCRW_input::placeholder{color:var(--dsw-alias-label-tertiary)}._7lJCRW_foot{justify-content:space-between;align-items:center;gap:12px;display:flex}._7lJCRW_hint{color:var(--dsw-alias-label-tertiary);font-size:12px}._7lJCRW_mentionList{z-index:20;border:1px solid var(--dsw-alias-border-l3);background:var(--dsw-alias-button-elevated-fill);max-height:240px;box-shadow:var(--dsw-shadow-lv2);border-radius:14px;padding:6px;position:absolute;bottom:calc(100% + 8px);left:12px;right:12px;overflow-y:auto}._7lJCRW_mentionItem{width:100%;color:var(--dsw-alias-label-primary);text-align:left;cursor:pointer;background:0 0;border:none;border-radius:8px;align-items:center;gap:10px;padding:8px 10px;display:flex}._7lJCRW_mentionItem:hover,._7lJCRW_mentionItem[data-active]{background:var(--dsw-alias-interactive-bg-hover)}._7lJCRW_mentionEmoji{flex:none;font-size:18px}._7lJCRW_mentionName{font-size:14px;font-weight:600}._7lJCRW_mentionIdentity{text-overflow:ellipsis;white-space:nowrap;min-width:0;color:var(--dsw-alias-label-tertiary);flex:1;font-size:12px;overflow:hidden}._7lJCRW_mentionEmpty{color:var(--dsw-alias-label-tertiary);text-align:center;padding:10px;font-size:13px}";
		const tagId$1 = "@deepseek-ai/dsh-client-qunliao-ui/GroupComposer.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$1) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@deepseek-ai/dsh-client-qunliao-ui";
			tag.dataset.pluginCss = tagId$1;
			tag.textContent = css$1;
			document.head.appendChild(tag);
		}
		var GroupComposer_module_css_default = {
			"root": "_7lJCRW_root",
			"mentionList": "_7lJCRW_mentionList",
			"mentionItem": "_7lJCRW_mentionItem",
			"input": "_7lJCRW_input",
			"mentionIdentity": "_7lJCRW_mentionIdentity",
			"hint": "_7lJCRW_hint",
			"foot": "_7lJCRW_foot",
			"mentionName": "_7lJCRW_mentionName",
			"mentionEmpty": "_7lJCRW_mentionEmpty",
			"mentionEmoji": "_7lJCRW_mentionEmoji"
		};
		//#endregion
		//#region src/client/GroupComposer.tsx
		/** 群聊输入区：接管默认 composer，发言走 /qunliao say（不触发主智能体）。 */
		/** 该会话是否为群聊（存在 qunliao-setup 隐藏节点）。 */
		function selectQunliaoComposer({ session }) {
			if (session === void 0) return null;
			const nodes = session.chat.nodes.values();
			for (const node of nodes) if (node.kind === "qunliao-setup") return { kind: "qunliao" };
			return null;
		}
		/** 从会话节点中读取群成员名单与讨论运行标记。 */
		function groupFactsOf(nodes) {
			let members = [];
			let running = false;
			for (const node of nodes) if (node.kind === "qunliao-setup") members = node.data.members.map(({ id, name, identity, emoji }) => ({
				id,
				name,
				identity,
				...emoji === void 0 ? {} : { emoji }
			}));
			else if (node.kind === "qunliao-state") running = node.data.running;
			return {
				members,
				running
			};
		}
		/** 讨论进行时找出光标前最近的 @ 提示位置。 */
		function mentionAt(text, caret) {
			const before = text.slice(0, caret);
			const lastAt = before.lastIndexOf("@");
			if (lastAt < 0) return null;
			const token = before.slice(lastAt + 1);
			if (/\s/u.test(token)) return null;
			return {
				index: lastAt,
				query: token
			};
		}
		/** 群聊输入区：@ 选人下拉 + 发送键（讨论中变为停止）。 */
		const GroupComposer = (0, react.memo)(function GroupComposer({ say, stop, useSession, t }) {
			const { members, running } = groupFactsOf(useSession((state) => state.chat.nodes.values()));
			const [text, setText] = (0, react.useState)("");
			const [busy, setBusy] = (0, react.useState)(false);
			const [mention, setMention] = (0, react.useState)(null);
			const [mentionActive, setMentionActive] = (0, react.useState)(0);
			const textareaRef = (0, react.useRef)(null);
			const composingRef = (0, react.useRef)(false);
			const filtered = (0, react.useMemo)(() => {
				if (mention === null) return [];
				const query = mention.query.trim();
				return members.filter((member) => query.length === 0 || member.name.includes(query) || member.identity.includes(query));
			}, [mention, members]);
			const refreshMention = (0, react.useCallback)((value, caret) => {
				if (composingRef.current) return;
				setMention(mentionAt(value, caret));
				setMentionActive(0);
			}, []);
			const pickMember = (0, react.useCallback)((name) => {
				setMention((current) => {
					if (current === null) return current;
					setText(text.slice(0, current.index) + "@" + name + " " + text.slice(current.index + 1 + current.query.length));
					requestAnimationFrame(() => {
						const el = textareaRef.current;
						if (el === null) return;
						el.focus();
						const caret = current.index + 1 + name.length + 1;
						el.setSelectionRange(caret, caret);
					});
					return null;
				});
			}, [text]);
			const submit = () => {
				const trimmed = text.trim();
				if (trimmed.length === 0 || busy) return;
				setBusy(true);
				say(trimmed).finally(() => {
					setBusy(false);
					setText("");
					setMention(null);
					textareaRef.current?.focus();
				});
			};
			const interrupt = () => {
				if (busy) return;
				setBusy(true);
				stop().finally(() => {
					setBusy(false);
				});
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: GroupComposer_module_css_default.root,
				"data-qunliao-composer": "",
				children: [
					mention !== null && filtered.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: GroupComposer_module_css_default.mentionList,
						role: "listbox",
						onMouseDown: (event) => {
							event.preventDefault();
						},
						children: filtered.map((member, index) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
							type: "button",
							role: "option",
							"aria-selected": index === mentionActive,
							className: GroupComposer_module_css_default.mentionItem,
							"data-active": index === mentionActive ? "" : void 0,
							onMouseEnter: () => {
								setMentionActive(index);
							},
							onClick: () => {
								pickMember(member.name);
							},
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: GroupComposer_module_css_default.mentionEmoji,
									"aria-hidden": "true",
									children: member.emoji ?? "👤"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: GroupComposer_module_css_default.mentionName,
									children: member.name
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: GroupComposer_module_css_default.mentionIdentity,
									children: member.identity
								})
							]
						}, member.id))
					}),
					mention !== null && filtered.length === 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: GroupComposer_module_css_default.mentionList,
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: GroupComposer_module_css_default.mentionEmpty,
							children: t("composer.mentionEmpty")
						})
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("textarea", {
						ref: textareaRef,
						className: GroupComposer_module_css_default.input,
						rows: 3,
						value: text,
						placeholder: t("composer.placeholder"),
						onChange: (event) => {
							const value = event.target.value;
							setText(value);
							refreshMention(value, event.target.selectionStart ?? value.length);
						},
						onKeyDown: (event) => {
							if (mention !== null && filtered.length > 0) {
								if (event.key === "ArrowDown") {
									event.preventDefault();
									setMentionActive((current) => (current + 1) % filtered.length);
									return;
								}
								if (event.key === "ArrowUp") {
									event.preventDefault();
									setMentionActive((current) => (current - 1 + filtered.length) % filtered.length);
									return;
								}
								if (event.key === "Enter" && !event.shiftKey) {
									event.preventDefault();
									const member = filtered[mentionActive];
									if (member !== void 0) pickMember(member.name);
									return;
								}
								if (event.key === "Escape") {
									event.preventDefault();
									setMention(null);
									return;
								}
							}
							if (event.key === "Enter" && !event.shiftKey) {
								event.preventDefault();
								submit();
							}
						},
						onCompositionStart: () => {
							composingRef.current = true;
						},
						onCompositionEnd: (event) => {
							composingRef.current = false;
							const value = event.currentTarget.value;
							setText(value);
							refreshMention(value, event.currentTarget.selectionStart ?? value.length);
						}
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: GroupComposer_module_css_default.foot,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: GroupComposer_module_css_default.hint,
							children: t("composer.hint")
						}), running ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
							variant: "primary",
							size: "sm",
							icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconStopFill16, { size: 14 }),
							disabled: busy,
							onClick: interrupt,
							children: t("composer.stop")
						}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
							variant: "primary",
							size: "sm",
							icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconNewChatOutline16, { size: 14 }),
							disabled: busy || text.trim().length === 0,
							onClick: submit,
							children: t("composer.send")
						})]
					})
				]
			});
		});
		//#endregion
		//#region \0dsh-css:C:\Users\明\Documents\Codex\2026-08-18\ban\work\harness\packages\qunliao\qunliao-ui\src\client\NewGroupChat.module.css.mjs
		const css = ".ze_O5W_entry{box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-button-elevated-fill);height:38px;color:var(--dsw-alias-label-primary);cursor:pointer;border-radius:12px;flex:none;justify-content:center;align-items:center;gap:6px;margin:0 2px 8px;padding:8px 16px;font-size:14px;font-weight:500;line-height:22px;display:flex;overflow:hidden}.ze_O5W_entry:hover{background:var(--dsw-alias-button-floating-hover)}.ze_O5W_entryRail{width:36px;height:36px;color:var(--dsw-alias-label-primary);cursor:pointer;background:0 0;border:none;border-radius:12px;justify-content:center;align-items:center;gap:0;margin:0;padding:0;display:flex}.ze_O5W_entryRail:hover{background:var(--dsw-alias-interactive-bg-hover)}.ze_O5W_entryIcon{flex:none}.ze_O5W_entryLabel{white-space:nowrap;text-overflow:ellipsis;overflow:hidden}.ze_O5W_body{flex-direction:column;gap:14px;max-height:60vh;display:flex;overflow-y:auto}.ze_O5W_field{flex-direction:column;gap:4px;min-width:0;display:flex}.ze_O5W_label{color:var(--dsw-alias-label-secondary);font-size:13px}.ze_O5W_roundsHint{color:var(--dsw-alias-label-tertiary);font-size:12px}.ze_O5W_grid{grid-template-columns:1fr 1fr;gap:10px;display:grid}.ze_O5W_membersHeader{justify-content:space-between;align-items:center;gap:10px;display:flex}.ze_O5W_members{flex-direction:column;gap:10px;display:flex}.ze_O5W_member{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-interactive-bg-hover);border-radius:10px;flex-direction:column;gap:8px;padding:10px;display:flex}.ze_O5W_memberHead{align-items:center;gap:8px;display:flex}.ze_O5W_memberIndex{background:var(--dsw-alias-interactive-bg-hover);width:20px;height:20px;color:var(--dsw-alias-label-secondary);border-radius:6px;justify-content:center;align-items:center;font-size:11px;display:inline-flex}.ze_O5W_memberTitle{color:var(--dsw-alias-label-primary);flex:1;font-size:14px;font-weight:600}.ze_O5W_remove{color:var(--dsw-alias-label-tertiary);cursor:pointer;background:0 0;border:none;border-radius:4px;padding:2px}.ze_O5W_remove:hover{color:var(--dsw-alias-state-error-primary);background:var(--dsw-alias-interactive-bg-hover)}.ze_O5W_select{border:1px solid var(--dsw-alias-border-l3);background:var(--dsw-specific-input-major);width:100%;color:var(--dsw-alias-label-primary);font:inherit;border-radius:8px;padding:8px 10px;font-size:14px}.ze_O5W_footer{justify-content:flex-end;align-items:center;gap:10px;width:100%;display:flex}.ze_O5W_error{color:var(--dsw-alias-state-error-primary);text-align:left;flex:1;font-size:12px}";
		const tagId = "@deepseek-ai/dsh-client-qunliao-ui/NewGroupChat.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@deepseek-ai/dsh-client-qunliao-ui";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		var NewGroupChat_module_css_default = {
			"entryRail": "ze_O5W_entryRail",
			"field": "ze_O5W_field",
			"member": "ze_O5W_member",
			"memberTitle": "ze_O5W_memberTitle",
			"label": "ze_O5W_label",
			"entryIcon": "ze_O5W_entryIcon",
			"entry": "ze_O5W_entry",
			"entryLabel": "ze_O5W_entryLabel",
			"remove": "ze_O5W_remove",
			"error": "ze_O5W_error",
			"footer": "ze_O5W_footer",
			"grid": "ze_O5W_grid",
			"members": "ze_O5W_members",
			"select": "ze_O5W_select",
			"roundsHint": "ze_O5W_roundsHint",
			"membersHeader": "ze_O5W_membersHeader",
			"body": "ze_O5W_body",
			"memberIndex": "ze_O5W_memberIndex",
			"memberHead": "ze_O5W_memberHead"
		};
		//#endregion
		//#region src/client/NewGroupChat.tsx
		/** 新建群聊：侧边栏入口按钮 + 成员配置弹窗（一体化组件）。 */
		function emptyMember() {
			return {
				name: "",
				identity: "",
				emoji: "",
				provider: "",
				model: ""
			};
		}
		/** 侧边栏入口 + 建群弹窗。 */
		const NewGroupChatEntry = (0, react.memo)(function NewGroupChatEntry({ wide, begin, submit, t }) {
			const [modalOpen, setModalOpen] = (0, react.useState)(false);
			const [sessionId, setSessionId] = (0, react.useState)(void 0);
			const [api, setApi] = (0, react.useState)(void 0);
			const open = async () => {
				const handle = await begin();
				if (handle === null) return;
				setSessionId(handle.sessionId);
				setApi(handle.api);
				setModalOpen(true);
			};
			if (!modalOpen || sessionId === void 0 || api === void 0) return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
				type: "button",
				className: wide ? NewGroupChat_module_css_default.entry : NewGroupChat_module_css_default.entryRail,
				"aria-label": t("entry.aria"),
				title: t("entry.hint"),
				onClick: () => {
					open();
				},
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconUserOutline16, {
					size: wide ? 14 : 18,
					className: NewGroupChat_module_css_default.entryIcon
				}), wide && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: NewGroupChat_module_css_default.entryLabel,
					children: t("entry.label")
				})]
			});
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(NewGroupChatModal, {
				sessionId,
				api,
				t,
				onClose: () => {
					setModalOpen(false);
				},
				submit
			});
		});
		/** 建群弹窗主体（api 在打开前由入口注入）。 */
		function NewGroupChatModal({ sessionId, api, t, onClose, submit }) {
			const [groupName, setGroupName] = (0, react.useState)("");
			const [rounds, setRounds] = (0, react.useState)("3");
			const [members, setMembers] = (0, react.useState)([emptyMember(), emptyMember()]);
			const [providers, setProviders] = (0, react.useState)([]);
			const [modelsStatus, setModelsStatus] = (0, react.useState)("loading");
			const [error, setError] = (0, react.useState)(null);
			const [busy, setBusy] = (0, react.useState)(false);
			(0, react.useEffect)(() => {
				api.sessions.models({ sessionId }).then(({ result }) => {
					if (!result.ok) {
						setModelsStatus("error");
						return;
					}
					setProviders(result.value.groups);
					setModelsStatus("ready");
				}, () => {
					setModelsStatus("error");
				});
			}, [sessionId, api]);
			const setMember = (index, patch) => {
				setMembers((list) => list.map((member, i) => i === index ? {
					...member,
					...patch
				} : member));
			};
			const addMember = () => setMembers((list) => [...list, emptyMember()]);
			const removeMember = (index) => {
				setMembers((list) => list.length <= 2 ? list : list.filter((_, i) => i !== index));
			};
			const modelsOf = (provider) => providers.find((group) => group.id === provider)?.models ?? [];
			const create = async () => {
				const name = groupName.trim();
				if (name.length === 0) {
					setError(t("modal.error.missing"));
					return;
				}
				if (members.length < 2) {
					setError(t("modal.error.minMembers"));
					return;
				}
				const roundsValue = Number(rounds);
				if (!Number.isInteger(roundsValue) || roundsValue < 1 || roundsValue > 10) {
					setError(t("manage.error.invalidRounds"));
					return;
				}
				const names = /* @__PURE__ */ new Set();
				for (const member of members) {
					const memberName = member.name.trim();
					if (memberName.length === 0 || member.identity.trim().length === 0 || member.provider.trim().length === 0 || member.model.trim().length === 0) {
						setError(t("modal.error.missing"));
						return;
					}
					if (names.has(memberName)) {
						setError(t("modal.error.duplicate"));
						return;
					}
					names.add(memberName);
				}
				setBusy(true);
				setError(null);
				try {
					const message = await submit(sessionId, {
						rounds: Number(rounds),
						name,
						members: members.map((member) => ({
							name: member.name.trim(),
							identity: member.identity.trim(),
							...member.emoji.trim().length > 0 ? { emoji: member.emoji.trim() } : {},
							provider: member.provider.trim(),
							model: member.model.trim()
						}))
					});
					if (message.startsWith("群聊")) onClose();
					else setError(t("modal.error.command", { message }));
				} catch (reason) {
					setError(t("modal.error.command", { message: reason instanceof Error ? reason.message : String(reason) }));
				} finally {
					setBusy(false);
				}
			};
			const providerOptions = providers.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
				value: "",
				children: modelsStatus === "loading" ? t("modal.loadingModels") : t("modal.loadModelsFailed")
			}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("option", {
				value: "",
				children: [t("modal.provider"), "…"]
			}), providers.map((group) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
				value: group.id,
				children: group.name
			}, group.id))] });
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Modal, {
				open: true,
				onClose: busy ? () => void 0 : onClose,
				title: t("modal.title"),
				closeLabel: t("modal.cancel"),
				description: t("modal.description"),
				footer: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: NewGroupChat_module_css_default.footer,
					children: [
						error !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: NewGroupChat_module_css_default.error,
							children: error
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
							variant: "ghost",
							size: "sm",
							disabled: busy,
							onClick: onClose,
							children: t("modal.cancel")
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
							variant: "primary",
							size: "sm",
							disabled: busy,
							onClick: () => {
								create();
							},
							children: busy ? t("modal.busy") : t("modal.create")
						})
					]
				}),
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: NewGroupChat_module_css_default.body,
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
							className: NewGroupChat_module_css_default.field,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: NewGroupChat_module_css_default.label,
								children: t("modal.groupName")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Input, {
								value: groupName,
								placeholder: t("modal.groupNamePlaceholder"),
								onChange: (event) => {
									setGroupName(event.target.value);
								}
							})]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
							className: NewGroupChat_module_css_default.field,
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: NewGroupChat_module_css_default.label,
									children: t("modal.rounds")
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Input, {
									value: rounds,
									placeholder: "3",
									inputMode: "numeric",
									onChange: (event) => {
										setRounds(event.target.value.replace(/[^0-9]/g, ""));
									}
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: NewGroupChat_module_css_default.roundsHint,
									children: t("modal.roundsHint")
								})
							]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: NewGroupChat_module_css_default.membersHeader,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
								className: NewGroupChat_module_css_default.label,
								children: [t("modal.members"), t("modal.memberCount", { n: members.length })]
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
								variant: "ghost",
								size: "sm",
								icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconPlusOutline16, { size: 14 }),
								onClick: addMember,
								children: t("modal.addMember")
							})]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: NewGroupChat_module_css_default.members,
							children: members.map((member, index) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: NewGroupChat_module_css_default.member,
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: NewGroupChat_module_css_default.memberHead,
										children: [
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
												className: NewGroupChat_module_css_default.memberIndex,
												children: index + 1
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
												className: NewGroupChat_module_css_default.memberTitle,
												children: member.name.trim() || `${t("modal.members")} ${index + 1}`
											}),
											members.length > 2 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
												type: "button",
												className: NewGroupChat_module_css_default.remove,
												"aria-label": t("modal.removeMember"),
												onClick: () => {
													removeMember(index);
												},
												children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCloseOutline16, { size: 14 })
											})
										]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: NewGroupChat_module_css_default.grid,
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
											className: NewGroupChat_module_css_default.field,
											children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
												className: NewGroupChat_module_css_default.label,
												children: t("modal.memberName")
											}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Input, {
												value: member.name,
												placeholder: t("modal.memberNamePlaceholder"),
												onChange: (event) => {
													setMember(index, { name: event.target.value });
												}
											})]
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
											className: NewGroupChat_module_css_default.field,
											children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
												className: NewGroupChat_module_css_default.label,
												children: t("modal.emoji")
											}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Input, {
												value: member.emoji,
												placeholder: t("modal.emojiPlaceholder"),
												onChange: (event) => {
													setMember(index, { emoji: event.target.value });
												}
											})]
										})]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
										className: NewGroupChat_module_css_default.field,
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: NewGroupChat_module_css_default.label,
											children: t("modal.identity")
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Input, {
											value: member.identity,
											placeholder: t("modal.identityPlaceholder"),
											onChange: (event) => {
												setMember(index, { identity: event.target.value });
											}
										})]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: NewGroupChat_module_css_default.grid,
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
											className: NewGroupChat_module_css_default.field,
											children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
												className: NewGroupChat_module_css_default.label,
												children: t("modal.provider")
											}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("select", {
												className: NewGroupChat_module_css_default.select,
												value: member.provider,
												disabled: modelsStatus !== "ready",
												onChange: (event) => {
													setMember(index, {
														provider: event.target.value,
														model: ""
													});
												},
												children: providerOptions
											})]
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
											className: NewGroupChat_module_css_default.field,
											children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
												className: NewGroupChat_module_css_default.label,
												children: t("modal.model")
											}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("select", {
												className: NewGroupChat_module_css_default.select,
												value: member.model,
												disabled: modelsStatus !== "ready" || member.provider.length === 0,
												onChange: (event) => {
													setMember(index, { model: event.target.value });
												},
												children: member.provider.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("option", {
													value: "",
													children: [t("modal.provider"), "…"]
												}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("option", {
													value: "",
													children: [t("modal.model"), "…"]
												}), modelsOf(member.provider).map((model) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
													value: model.id,
													children: model.name
												}, model.id))] })
											})]
										})]
									})
								]
							}, index))
						})
					]
				})
			});
		}
		//#endregion
		//#region src/client/definitions.ts
		/** 成员发言定义：每个 qunliao/message 渲染为一个成员气泡。 */
		const qunliaoMemberDefinition = {
			kind: "qunliao-member",
			target: "chat",
			match: (event) => event.type === "qunliao/message" ? {
				id: String(event.data.messageId),
				role: "start"
			} : null,
			start: (_context, match) => {
				if (match.event.type !== "qunliao/message") throw new Error("qunliao-member start requires qunliao/message");
				const { messageId, speakerId, speakerName, emoji, text, turn } = match.event.data;
				return {
					messageId,
					speakerId,
					speakerName,
					...emoji === void 0 ? {} : { emoji },
					text,
					turn,
					time: match.event.time,
					seq: match.event.seq
				};
			},
			update: (context) => context.state,
			buildViewNode: (context) => {
				if (context.state === void 0) return null;
				const { seq, ...data } = context.state;
				return {
					key: context.key,
					kind: "qunliao-member",
					id: context.id,
					target: "chat",
					anchorSeq: seq - .1,
					location: context.start?.location ?? { kind: "unresolved" },
					visibility: "visible",
					data
				};
			}
		};
		/** 建群定义：隐藏状态节点，标记该会话为群聊（供讨论开关按钮显示）。 */
		const qunliaoSetupDefinition = {
			kind: "qunliao-setup",
			target: "chat",
			match: (event) => event.type === "qunliao/setup" ? {
				id: `setup-${event.seq}`,
				role: "start"
			} : null,
			start: (_context, match) => {
				if (match.event.type !== "qunliao/setup") throw new Error("qunliao-setup start requires qunliao/setup");
				return match.event.data;
			},
			update: (context) => context.state,
			buildViewNode: (context) => {
				if (context.state === void 0) return null;
				return {
					key: context.key,
					kind: "qunliao-setup",
					id: context.id,
					target: "chat",
					anchorSeq: context.start?.event.seq === void 0 ? 0 : context.start.event.seq - .1,
					location: context.start?.location ?? { kind: "unresolved" },
					visibility: "hidden",
					data: context.state
				};
			}
		};
		/** 开关状态定义：隐藏状态节点，供讨论开关按钮读取开关与运行标记。 */
		const qunliaoStateDefinition = {
			kind: "qunliao-state",
			target: "chat",
			match: (event) => event.type === "qunliao/state" ? {
				id: `state-${event.seq}`,
				role: "start"
			} : null,
			start: (_context, match) => {
				if (match.event.type !== "qunliao/state") throw new Error("qunliao-state start requires qunliao/state");
				return match.event.data;
			},
			update: (context) => context.state,
			buildViewNode: (context) => {
				if (context.state === void 0) return null;
				return {
					key: context.key,
					kind: "qunliao-state",
					id: context.id,
					target: "chat",
					anchorSeq: context.start?.event.seq === void 0 ? 0 : context.start.event.seq - .1,
					location: context.start?.location ?? { kind: "unresolved" },
					visibility: "hidden",
					data: context.state
				};
			}
		};
		//#endregion
		//#region src/client/locales.ts
		/** 群聊 UI 插件的词典：新群聊入口、建群弹窗、讨论开关与成员气泡。 */
		/** 中文词典（键集为准）。 */
		const zh = {
			"entry.label": "新群聊",
			"entry.aria": "新建群聊",
			"entry.hint": "创建一个由多个 AI 身份组成的群聊，成员可以按顺序讨论，也可以 @ 点名发言",
			"modal.title": "新建群聊",
			"modal.description": "添加成员并给每个人设定名字、身份和模型。创建后先由你发言，再打开右上角讨论开关。",
			"modal.groupName": "群名",
			"modal.groupNamePlaceholder": "例如：产品评审会",
			"modal.members": "群成员",
			"modal.memberCount": "（{n} 人）",
			"modal.addMember": "添加成员",
			"modal.memberName": "名字",
			"modal.memberNamePlaceholder": "例如：小林",
			"modal.identity": "身份设定",
			"modal.identityPlaceholder": "例如：产品经理，负责评估需求价值",
			"modal.emoji": "头像（可选）",
			"modal.emojiPlaceholder": "🙂",
			"modal.provider": "模型提供方",
			"modal.model": "模型",
			"modal.create": "创建群聊",
			"modal.cancel": "取消",
			"modal.busy": "创建中…",
			"modal.removeMember": "移除该成员",
			"modal.error.minMembers": "至少需要 2 位成员",
			"modal.error.missing": "请填写群名，并给每位成员填写名字、身份与模型",
			"modal.error.duplicate": "成员名字不能重复",
			"modal.error.command": "创建群聊失败：{message}",
			"modal.loadingModels": "加载模型列表…",
			"modal.loadModelsFailed": "模型列表加载失败，可手动填写",
			"modal.modelFallback": "（未加载到列表，请手动输入）",
			"modal.rounds": "讨论轮数",
			"modal.roundsHint": "开启讨论后成员最多轮流讨论几轮（1-10）",
			"manage.members": "群成员",
			"manage.memberCount": "（{n} 人）",
			"manage.addMember": "添加成员",
			"manage.addMemberTitle": "添加群成员",
			"manage.addMemberHint": "填写名字、身份与模型，确定后新成员立即进群",
			"manage.rounds": "讨论轮数",
			"manage.roundsButton": "{n} 轮",
			"manage.roundsTitle": "设置讨论轮数",
			"manage.roundsHint": "开启讨论后成员最多轮流讨论几轮（1-10），下次开启时生效",
			"manage.save": "保存",
			"manage.busy": "处理中…",
			"manage.done": "已保存",
			"manage.error.missing": "请填写成员的名字、身份与模型",
			"manage.error.duplicate": "成员名字不能重复",
			"manage.error.invalidRounds": "轮数需为 1-10 的整数",
			"manage.error.command": "操作失败：{message}",
			"manage.mute": "闭嘴",
			"manage.unmute": "解除",
			"manage.mutedTag": "已闭嘴",
			"manage.muteHint": "闭嘴后：自动讨论跳过 TA，@ TA 也不会发言；点「解除」恢复。",
			"toggle.off": "开始讨论",
			"toggle.on": "停止讨论",
			"toggle.tooltip": "讨论开关：点一下成员开始按顺序发言，再点一下停止/打断",
			"toggle.running": "停止讨论",
			"member.says": "{name} 说",
			"composer.hint": "输入 @ 选人即可点名成员发言",
			"composer.placeholder": "发消息… 输入 @ 选人",
			"composer.send": "发送",
			"composer.stop": "停止",
			"composer.mentionEmpty": "没有匹配的成员"
		};
		/** 英文词典。 */
		const en = {
			"entry.label": "New Group",
			"entry.aria": "New group chat",
			"entry.hint": "Create a group chat with multiple AI personas that discuss in turn or answer mentions",
			"modal.title": "New Group Chat",
			"modal.description": "Add members with a name, persona, and model each. You speak first, then flip the discussion switch.",
			"modal.groupName": "Group name",
			"modal.groupNamePlaceholder": "e.g. Product review",
			"modal.members": "Members",
			"modal.memberCount": " ({n})",
			"modal.addMember": "Add member",
			"modal.memberName": "Name",
			"modal.memberNamePlaceholder": "e.g. Alex",
			"modal.identity": "Persona",
			"modal.identityPlaceholder": "e.g. Product manager focused on value",
			"modal.emoji": "Avatar (optional)",
			"modal.emojiPlaceholder": "🙂",
			"modal.provider": "Provider",
			"modal.model": "Model",
			"modal.create": "Create group",
			"modal.cancel": "Cancel",
			"modal.busy": "Creating…",
			"modal.removeMember": "Remove member",
			"modal.error.minMembers": "At least 2 members are required",
			"modal.error.missing": "Fill in the group name and every member name, persona, and model",
			"modal.error.duplicate": "Member names must be unique",
			"modal.error.command": "Failed to create group: {message}",
			"modal.loadingModels": "Loading models…",
			"modal.loadModelsFailed": "Failed to load models; you can type manually",
			"modal.modelFallback": " (no list; type manually)",
			"modal.rounds": "Discussion rounds",
			"modal.roundsHint": "Max rounds each member speaks (1-10)",
			"manage.members": "Members",
			"manage.memberCount": " ({n})",
			"manage.addMember": "Add member",
			"manage.addMemberTitle": "Add member to group",
			"manage.addMemberHint": "Fill in name, persona and model; the member joins immediately",
			"manage.rounds": "Discussion rounds",
			"manage.roundsButton": "{n} rounds",
			"manage.roundsTitle": "Set discussion rounds",
			"manage.roundsHint": "Max rounds each member speaks (1-10); applies next time",
			"manage.save": "Save",
			"manage.busy": "Working…",
			"manage.done": "Saved",
			"manage.error.missing": "Fill in the member name, persona and model",
			"manage.error.duplicate": "Member names must be unique",
			"manage.error.invalidRounds": "Rounds must be an integer from 1 to 10",
			"manage.error.command": "Failed: {message}",
			"manage.mute": "Mute",
			"manage.unmute": "Unmute",
			"manage.mutedTag": "Muted",
			"manage.muteHint": "Muted members skip auto discussion and ignore mentions; unmute to restore.",
			"toggle.off": "Start discussion",
			"toggle.on": "Stop discussion",
			"toggle.tooltip": "Discussion switch: click to let members speak in turn, click again to stop/interrupt",
			"toggle.running": "Stop discussion",
			"member.says": "{name} says",
			"composer.hint": "Type @ to pick a member and address them",
			"composer.placeholder": "Message… type @ to pick a member",
			"composer.send": "Send",
			"composer.stop": "Stop",
			"composer.mentionEmpty": "No matching member"
		};
		//#endregion
		//#region src/client/index.ts
		/** 词典命名空间。 */
		const NS = "qunliao";
		/** 所需服务。 */
		const inject = [
			"slots",
			"locale",
			"sessions",
			"connection",
			"conversationEvents"
		];
		/** 等待会话绑定就绪（最多 5 秒）。 */
		async function waitForSession(ctx, sessionId, timeoutMs = 5e3) {
			const deadline = Date.now() + timeoutMs;
			while (Date.now() < deadline) {
				if (ctx.sessions.binding(sessionId)?.session !== void 0) return true;
				await new Promise((resolve) => setTimeout(resolve, 50));
			}
			return false;
		}
		/** 对某会话执行一条 /qunliao 命令，返回结果文本。 */
		async function runQunliaoCommand(ctx, sessionId, line) {
			if (!await waitForSession(ctx, sessionId)) return {
				ok: false,
				text: "会话尚未就绪"
			};
			const session = ctx.sessions.binding(sessionId)?.session;
			if (session === void 0) return {
				ok: false,
				text: "会话尚未就绪"
			};
			const result = await session.command(line);
			if (!result.ok) return {
				ok: false,
				text: `${result.error.code}: ${result.error.message}`
			};
			return {
				ok: true,
				text: result.value.matched ? "ok" : "命令未被识别"
			};
		}
		/**
		* 安装群聊表面。
		* @param ctx - 浏览器插件上下文。
		*/
		function apply(ctx) {
			ctx.conversationEvents.register(qunliaoMemberDefinition);
			ctx.conversationEvents.register(qunliaoSetupDefinition);
			ctx.conversationEvents.register(qunliaoStateDefinition);
			ctx.effect(() => ctx.locale.register(NS, {
				zh,
				en
			}), "qunliao-ui: dictionaries");
			ctx.slots.inject("conversation.chat.node", () => ctx.slots.register({
				name: "conversation.chat.node",
				key: "qunliao-member",
				locale: NS
			}, MemberMessage));
			ctx.slots.inject("conversation.composer", () => ctx.slots.register({
				name: "conversation.composer",
				select: selectQunliaoComposer,
				priority: -20,
				locale: NS,
				inject: (sessionId) => ({
					say: async (text) => {
						await runQunliaoCommand(ctx, sessionId, `/qunliao say ${text}`);
					},
					stop: async () => {
						await runQunliaoCommand(ctx, sessionId, "/qunliao toggle off");
					}
				})
			}, GroupComposer));
			ctx.slots.inject("conversation.session.header.actions", () => ctx.slots.register({
				name: "conversation.session.header.actions",
				id: "qunliao-toggle",
				order: 20,
				locale: NS,
				inject: (sessionId) => ({ toggle: async (on) => {
					await runQunliaoCommand(ctx, sessionId, `/qunliao toggle ${on ? "on" : "off"}`);
				} })
			}, GroupToggleButton));
			ctx.slots.inject("conversation.session.header.actions", () => ctx.slots.register({
				name: "conversation.session.header.actions",
				id: "qunliao-manage",
				order: 30,
				locale: NS,
				inject: (sessionId) => {
					return {
						api: ctx.get("connection").api,
						sessionId,
						addMember: async (member) => {
							return (await runQunliaoCommand(ctx, sessionId, `/qunliao add ${JSON.stringify(member)}`)).text;
						},
						setRounds: async (rounds) => {
							return (await runQunliaoCommand(ctx, sessionId, `/qunliao rounds ${rounds}`)).text;
						},
						setMuted: async (memberId, muted) => {
							return (await runQunliaoCommand(ctx, sessionId, `/qunliao mute ${memberId} ${muted ? "on" : "off"}`)).text;
						}
					};
				}
			}, GroupManageButton));
			ctx.slots.inject("sidebar.newSession.action", () => ctx.slots.register({
				name: "sidebar.newSession.action",
				id: "qunliao",
				order: 0,
				locale: NS,
				inject: () => ({
					begin: async () => {
						const api = ctx.get("connection").api;
						try {
							const workspaceSnapshot = ctx.get("workspaces").list.getSnapshot();
							const currentSession = ctx.sessions.list.getSnapshot().current;
							const workspaceId = (currentSession === void 0 ? void 0 : workspaceSnapshot.items.find((item) => item.sessionIds.includes(currentSession))?.workspaceId) ?? workspaceSnapshot.recentWorkspaceId;
							const response = await api.sessions.create({ ...workspaceId === void 0 ? {} : { workspaceId } });
							if (!response.result.ok) return null;
							const sessionId = response.result.value.sessionId;
							ctx.sessions.open(sessionId);
							return {
								sessionId,
								api
							};
						} catch (reason) {
							console.warn("qunliao: create session failed", reason);
							return null;
						}
					},
					submit: async (sessionId, payload) => {
						const result = await runQunliaoCommand(ctx, sessionId, `/qunliao create ${JSON.stringify(payload)}`);
						if (!result.ok) return result.text;
						const session = ctx.sessions.binding(sessionId)?.session;
						if (session !== void 0) await session.rename(payload.name);
						return "群聊创建成功";
					}
				})
			}, NewGroupChatEntry));
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map