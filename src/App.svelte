<script>
	import { problem1, problem2, problem3, problem4 } from "./problem";

	let isRequestModalOpen = false;
	let isProblemModalOpen = false;
	let currentProblem = problem1;
	let currentProblemCopy = JSON.parse(JSON.stringify(currentProblem));
	let request = currentProblem.resource.map(() => 0);
	let requestMadeBy = "";
	let isResultModalOpen = false;
	let queryInfo = "";
	let queryResult = "";
	$: totalResources = 1;
	$: totalProcess = 1;

	const getSafeSequence = (a) => {
		// let process = currentProblem.process;
		// let resource = currentProblem.resource
		// let totalInstances = currentProblem.totalResources
		// let availableResources = currentProblem.availableResources
		// let allocationMatrix = currentProblem.allocationMatrix
		// let maxMatrix = currentProblem.maxMatrix
		// let needMatrix = currentProblem.needMatrix

		let numberOfProcess = currentProblem.process.length;
		let executionOrder = [];
		let temp = JSON.parse(JSON.stringify(currentProblem));

		while (true) {
			let executedProcess = 0;
			currentProblem.process.forEach((process, idx) => {
				if (SA(process)) {
					executedProcess += 1;
					numberOfProcess -= 1;
					let temp = JSON.parse(JSON.stringify(currentProblem));
					console.log("Before allocation", temp);
					updateAvailableReousrces(process);
					temp = JSON.parse(JSON.stringify(currentProblem));
					console.log("After allocation", temp);
					executionOrder.push(process);
				}
			});
			if (executedProcess === 0) break;
		}

		if (a === 1) currentProblem = temp;

		if (numberOfProcess > 0) {
			console.log("Vro deadlock ho gaya");
			if (a != 1) {
				isRequestModalOpen = false;
				isResultModalOpen = true;
				queryInfo = "Safe sequence for current problem";
				queryResult =
					"Current Problem is in deadlock condtion thus no safe sequence";
			}
			return false;
		} else {
			console.log("Vro deadlock se bacch gaye");
			console.log(executionOrder);
			if (a != 1) {
				isRequestModalOpen = false;
				isResultModalOpen = true;
				queryInfo = "Safe sequence for current problem";
				queryResult = `Safe sequence -> ${executionOrder}`;
			}
			return true;
		}
	};

	const makeRequest = () => {
		let temp = "";
		currentProblem.resource.forEach((resource, idx) => {
			if (idx === currentProblem.resource.length - 1)
				return (temp += ` Resource ${resource} -> ${request[idx]} instances`);
			else
				return (temp += ` Resource ${resource} -> ${request[idx]} instances,`);
		});
		queryInfo = `You have requested process ${requestMadeBy} to provide process ${requestMadeBy},${temp} `;
		for (let i = 0; i < currentProblem.process.length; i++) {
			let process = currentProblem.process[i];
			if (requestMadeBy === process) {
				if (checkValidityOfRequest()) {
					queryResult =
						"Your request is processed because it was valid";
				} else {
					queryResult =
						"Your request is not processed because it was invalid";
					reset();
				}
				isRequestModalOpen = false;
				isResultModalOpen = true;
				return;
			}
		}
		reset();
		isRequestModalOpen = false;
		isResultModalOpen = true;
		queryResult = "Your request is not processed because it was invalid";
		console.log("no such process", requestMadeBy.toString(), request);
		return;
	};

	const checkValidityOfRequest = () => {
		if (RRA(request, requestMadeBy)) {
			//checking for safety of request
			grantResources(request, requestMadeBy);
			if (!getSafeSequence(1)) {
				backtrackResources(request, requestMadeBy);
				console.log("Vro galat request ki process nai");
				return false;
			} else {
				console.log("Vro Sahi request ki process nai");
				return true;
			}
			// currentProblem.availableResources = temp.slice();
		} else {
			// backtrackResources(request, requestMadeBy);
			console.log("Vro galat request ki process nai 2");
			return false;
		}
	};

	const updateAvailableReousrces = (process) => {
		currentProblem.availableResources.forEach((instance, idx) => {
			currentProblem.availableResources[idx] +=
				currentProblem.allocationMatrix[process][idx];
			currentProblem.allocationMatrix[process][idx] = 0;
			currentProblem.needMatrix[process][idx] = 0;
		});
	};

	const canBeExecuted = (process) => {
		let zeroInstanceCounter = 0;
		for (
			let idx = 0;
			idx < currentProblem.availableResources.length;
			idx++
		) {
			let instance = currentProblem.availableResources[idx];
			if (currentProblem.needMatrix[process][idx] > instance)
				return false;

			if (currentProblem.needMatrix[process][idx] === 0)
				zeroInstanceCounter++;
		}
		if (zeroInstanceCounter === currentProblem.resource.length)
			return false;
		return true;
	};

	const RRA = (request, requestMadeBy) => {
		for (
			let idx = 0;
			idx < currentProblem.needMatrix[requestMadeBy].length;
			idx++
		) {
			let instance = currentProblem.needMatrix[requestMadeBy][idx];
			if (request[idx] > instance) return false;
		}

		for (
			let idx = 0;
			idx < currentProblem.availableResources.length;
			idx++
		) {
			let instance = currentProblem.availableResources[idx];
			if (request[idx] > instance) return false;
		}

		return true;
	};

	const SA = (process) => {
		let zeroInstanceCounter = 0;
		for (
			let idx = 0;
			idx < currentProblem.availableResources.length;
			idx++
		) {
			let instance = currentProblem.availableResources[idx];
			if (currentProblem.needMatrix[process][idx] > instance)
				return false;
			if (currentProblem.needMatrix[process][idx] === 0)
				zeroInstanceCounter++;
		}
		if (zeroInstanceCounter === currentProblem.resource.length)
			return false;

		// currentProblem.availableResources.forEach((instance, idx) => {
		// 	currentProblem.availableResources[idx] +=
		// 		currentProblem.allocationMatrix[process][idx];
		// });

		return true;
	};

	const grantResources = (request, requestMadeBy) => {
		currentProblem.resource.forEach((_, idx) => {
			currentProblem.availableResources[idx] -= request[idx];
			currentProblem.needMatrix[requestMadeBy][idx] -= request[idx];
			currentProblem.allocationMatrix[requestMadeBy][idx] += request[idx];
		});
	};

	const backtrackResources = (request, requestMadeBy) => {
		currentProblem.resource.forEach((_, idx) => {
			currentProblem.availableResources[idx] += request[idx];
			currentProblem.needMatrix[requestMadeBy][idx] += request[idx];
			currentProblem.allocationMatrix[requestMadeBy][idx] -= request[idx];
		});
	};

	const updateProblem = (e) => {
		const problem = e.target.value;
		if (problem === "problem1") {
			currentProblem = problem1;
			currentProblemCopy = JSON.parse(JSON.stringify(currentProblem));
		} else if (problem === "problem2") {
			currentProblem = problem2;
			currentProblemCopy = JSON.parse(JSON.stringify(currentProblem));
		} else if (problem === "problem3") {
			currentProblem = problem3;
			currentProblemCopy = JSON.parse(JSON.stringify(currentProblem));
		} else {
			currentProblem = problem4;
			currentProblemCopy = JSON.parse(JSON.stringify(currentProblem));
		}
	};

	const reset = () => {
		currentProblem = currentProblemCopy;
	};
</script>

<main>
	<div class={isProblemModalOpen ? "showModal modal " : "hideModal modal "}>
		<div class="modal-div modal-width">
			<div class="modal-header">
				<h5 class="modal-title">Enter A Problem</h5>
				<button
					type="button"
					class="close"
					on:click={() => (isProblemModalOpen = false)}
				>
					<span aria-hidden="true">&times;</span>
				</button>
			</div>
			<div class="modal-body">
				<div>
					<span>Number Of Processes:</span>
					<input
						type="number"
						min="1"
						placeholder="1"
						value={totalProcess}
						on:change={(e) =>
							(totalProcess = parseInt(e.target.value))}
					/>
				</div>

				<div style="height:1rem;" />

				<div>
					<span>Number Of Resources:</span>
					<input
						type="number"
						min="1"
						placeholder="1"
						value={totalResources}
						on:change={(e) =>
							(totalResources = parseInt(e.target.value))}
					/>
				</div>

				<div style="height:2rem;" />

				<div class="table-div">
					<div class="mdc-data-table">
						<div class="mdc-data-table__table-container">
							<table
								class="mdc-data-table__table"
								aria-label="Banker's Table"
							>
								<thead>
									<tr class="mdc-data-table__header-row">
										<th
											class="mdc-data-table__header-cell"
											role="columnheader"
											scope="col"
											rowspan="2"
											style="width: {100 / 4}%"
										>
											Process
										</th>
										<th
											class="mdc-data-table__header-cell mdc-data-table__header-cell--numeric"
											role="columnheader"
											scope="col"
											style="width: {100 / 4}%"
											colspan={totalResources}
										>
											Allocation
										</th>
										<th
											class="mdc-data-table__header-cell mdc-data-table__header-cell--numeric"
											role="columnheader"
											scope="col"
											style="width: {100 / 4}%"
											colspan={totalResources}
										>
											MAX
										</th>
										<th
											class="mdc-data-table__header-cell"
											role="columnheader"
											scope="col"
											style="width: {100 / 4}%"
											colspan={totalResources}
										>
											Need
										</th>
									</tr>
									<tr class="mdc-data-table__header-row">
										{#each Array(3) as _, i}
											{#each Array(totalResources) as _, resource}
												<th
													class="mdc-data-table__header-cell mdc-data-table__header-cell--numeric"
													role="columnheader"
													scope="col"
												>
													R{resource + 1}
												</th>
											{/each}
										{/each}
									</tr>
								</thead>
								<tbody class="mdc-data-table__content">
									{#each Array(totalProcess) as _, process}
										<tr class="mdc-data-table__row">
											<th
												class="mdc-data-table__cell"
												scope="row"
											>
												P{process}
											</th>
											{#each Array(totalResources) as _, instance}
												<td
													class="mdc-data-table__cell mdc-data-table__cell--numeric"
													style="width:{100 / 4}%"
												>
													<input
														type="number"
														placeholder="0"
														min="0"
														style="width:{100 /
															totalResources}%"
													/>
												</td>
											{/each}
											{#each Array(totalResources) as _, instance}
												<td
													class="mdc-data-table__cell mdc-data-table__cell--numeric"
													style="width:{100 / 4}%"
												>
													<input
														type="number"
														placeholder="0"
														min="0"
														style="width:{100 /
															totalResources}%"
													/>
												</td>
											{/each}
											{#each Array(totalResources) as _, instance}
												<td
													class="mdc-data-table__cell mdc-data-table__cell--numeric"
													style="width:{100 / 4}%"
												>
													<input
														type="number"
														placeholder="0"
														min="0"
														style="width:{100 /
															totalResources}%"
													/>
												</td>
											{/each}
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
			<div class="modal-footer">
				<button
					type="button"
					class="btn btn-secondary"
					on:click={() => (isRequestModalOpen = false)}>Close</button
				>
				<button
					type="button"
					class="btn btn-primary"
					on:click={() => makeRequest()}
				>
					Request
				</button>
			</div>
		</div>
	</div>
	<div class={isRequestModalOpen ? "showModal modal" : "hideModal modal"}>
		<div class="modal-div">
			<div class="modal-header">
				<h5 class="modal-title">Request A Resource</h5>
				<button
					type="button"
					class="close"
					on:click={() => (isRequestModalOpen = false)}
				>
					<span aria-hidden="true">&times;</span>
				</button>
			</div>
			<div class="modal-body">
				<span>Process Name:</span>
				<input
					type="text"
					id="process_name"
					value={requestMadeBy}
					on:change={(e) => (requestMadeBy = e.target.value)}
				/>

				<div style="height:2rem;" />

				{#each currentProblem.resource as resource, index}
					<div>
						<span style="display:inline-block;">{resource} : </span>
						<input
							type="number"
							value={request[index]}
							on:change={(e) =>
								(request[index] = parseInt(e.target.value))}
							min="0"
						/>
					</div>
					<div style="height:1rem;" />
				{/each}
			</div>
			<div class="modal-footer">
				<button
					type="button"
					class="btn btn-secondary"
					on:click={() => (isRequestModalOpen = false)}>Close</button
				>
				<button
					type="button"
					class="btn btn-primary"
					on:click={() => makeRequest()}
				>
					Request
				</button>
			</div>
		</div>
	</div>

	<div class={isResultModalOpen ? "showModal modal" : "hideModal modal"}>
		<div class="modal-div">
			<div class="modal-header">
				<h5 class="modal-title">Response For Your Query</h5>
				<button
					type="button"
					class="close"
					on:click={() => (isResultModalOpen = false)}
				>
					<span aria-hidden="true">&times;</span>
				</button>
			</div>
			<div class="modal-body">
				<p>{queryInfo}</p>
				<p>{queryResult}</p>
			</div>
		</div>
	</div>

	<div class="header">Banker's Algorithm</div>
	<div class="main-div">
		<div class="top-div">
			<!-- <h1>Enter a Problem</h1>
			<span>OR</span> -->
			<div class="select-problem-div">
				<label for="problem">Choose a course assingment (OS-100)</label>
				<select
					id="problem"
					name="question"
					on:change={(e) => updateProblem(e)}
				>
					<option value="problem1"> Assingment 6 - Problem 1 </option>
					<option value="problem2"> Assingment 6 - Problem 2 </option>
					<option value="problem3"> Assingment 6 - Problem 3 </option>
					<option value="problem4"> Assingment 6 - Problem 4 </option>
				</select>
			</div>
		</div>
		<div class="bottom-div">
			<div class="bottom-left-div">
				<h1>Total Resources</h1>
				<div class="mdc-data-table">
					<div class="mdc-data-table__table-container">
						<table
							class="mdc-data-table__table"
							aria-label="Total Resources"
						>
							<thead>
								<tr class="mdc-data-table__header-row">
									{#each currentProblem.resource as resource}
										<th
											class="mdc-data-table__header-cell"
											role="columnheader"
											scope="col"
										>
											{resource}
										</th>
									{/each}
								</tr>
							</thead>
							<tbody class="mdc-data-table__content">
								<tr class="mdc-data-table__row">
									{#each currentProblem.totalResources as resourceValue}
										<td
											class="mdc-data-table__cell mdc-data-table__cell--numeric"
										>
											{resourceValue}
										</td>
									{/each}
								</tr>
							</tbody>
						</table>
					</div>
				</div>

				<h1>Available Resources</h1>
				<div class="mdc-data-table">
					<div class="mdc-data-table__table-container">
						<table
							class="mdc-data-table__table"
							aria-label="Available Resources"
						>
							<thead>
								<tr class="mdc-data-table__header-row">
									{#each currentProblem.resource as resource}
										<th
											class="mdc-data-table__header-cell"
											role="columnheader"
											scope="col"
										>
											{resource}
										</th>
									{/each}
								</tr>
							</thead>
							<tbody class="mdc-data-table__content">
								<tr class="mdc-data-table__row">
									{#each currentProblem.availableResources as resourceValue}
										<td
											class="mdc-data-table__cell mdc-data-table__cell--numeric"
										>
											{resourceValue}
										</td>
									{/each}
								</tr>
							</tbody>
						</table>
					</div>
				</div>

				<div class="button-div">
					<div class="mdc-touch-target-wrapper">
						<button
							class="mdc-button mdc-button--touch"
							on:click={getSafeSequence}
						>
							<span class="mdc-button__ripple" />
							<span class="mdc-button__touch" />
							<span class="mdc-button__label"
								>Get Safe Sequence</span
							>
						</button>
					</div>
					<div class="mdc-touch-target-wrapper">
						<button
							class="mdc-button mdc-button--touch"
							on:click={() => (isRequestModalOpen = true)}
						>
							<span class="mdc-button__ripple" />
							<span class="mdc-button__touch" />
							<span class="mdc-button__label"
								>Request Resource</span
							>
						</button>
					</div>
					<div class="mdc-touch-target-wrapper">
						<button
							class="mdc-button mdc-button--touch"
							on:click={reset}
						>
							<span class="mdc-button__ripple" />
							<span class="mdc-button__touch" />
							<span class="mdc-button__label">Reset</span>
						</button>
					</div>
				</div>
			</div>
			<div class="bottom-right-div">
				<div class="mdc-data-table">
					<div class="mdc-data-table__table-container">
						<table
							class="mdc-data-table__table"
							aria-label="Banker's Table"
						>
							<thead>
								<tr class="mdc-data-table__header-row">
									<th
										class="mdc-data-table__header-cell"
										role="columnheader"
										scope="col"
										rowspan="2"
									>
										Process
									</th>
									<th
										class="mdc-data-table__header-cell mdc-data-table__header-cell--numeric"
										role="columnheader"
										scope="col"
										colspan="3"
									>
										Allocation
									</th>
									<th
										class="mdc-data-table__header-cell mdc-data-table__header-cell--numeric"
										role="columnheader"
										scope="col"
										colspan="3"
									>
										MAX
									</th>
									<th
										class="mdc-data-table__header-cell"
										role="columnheader"
										scope="col"
										colspan="3"
									>
										Need
									</th>
								</tr>
								<tr class="mdc-data-table__header-row">
									{#each Array(3) as _, i}
										{#each currentProblem.resource as resource}
											<th
												class="mdc-data-table__header-cell mdc-data-table__header-cell--numeric"
												role="columnheader"
												scope="col"
											>
												{resource}
											</th>
										{/each}
									{/each}
								</tr>
							</thead>
							<tbody class="mdc-data-table__content">
								{#each currentProblem.process as process}
									<tr class="mdc-data-table__row">
										<th
											class="mdc-data-table__cell"
											scope="row"
										>
											{process}
										</th>
										{#each currentProblem.allocationMatrix[process] as instance}
											<td
												class="mdc-data-table__cell mdc-data-table__cell--numeric"
											>
												{instance}
											</td>
										{/each}
										{#each currentProblem.maxMatrix[process] as instance}
											<td
												class="mdc-data-table__cell mdc-data-table__cell--numeric"
											>
												{instance}
											</td>
										{/each}
										{#each currentProblem.needMatrix[process] as instance}
											<td
												class="mdc-data-table__cell mdc-data-table__cell--numeric"
											>
												{instance}
											</td>
										{/each}
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
		<div class="footer">
			Made Using Svelte and ❤️ By Arun Singh Kushwaha (2020IMT016)
		</div>
	</div>

	<a
		href="https://github.com/arun-kushwaha04/Banker-Algorithm"
		target="_blank"
		rel="noopener"
		><img
			width="149"
			height="149"
			src="https://github.blog/wp-content/uploads/2008/12/forkme_right_darkblue_121621.png?resize=149%2C149"
			alt="Fork me on GitHub"
		/>
	</a>
</main>

<style>
	@import url("https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css");
	main {
		text-align: center;
		max-width: 240px;
		margin: 0 auto;
		position: relative;
	}

	.modal {
		height: 100%;
		width: 100%;
		top: 0;
		left: 0;
		align-items: center;
		justify-content: center;
		position: absolute;
		background-color: rgba(56, 55, 55, 0.877);
	}

	.modal-div {
		width: 40%;
		height: auto;
		margin: auto;
		border: 1px solid #fff;
	}
	.modal-body {
		width: 100%;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}

	.showModal {
		display: flex;
	}
	.hideModal {
		display: none;
	}

	.modal-width {
		width: 90%;
		height: 100%;
	}

	.table-div {
		width: 100%;
		max-height: 70%;
	}
</style>
