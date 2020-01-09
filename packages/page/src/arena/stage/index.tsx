// eslint-disable-next-line
import React, { useState, useEffect } from 'react'
import { HashRouter, Switch, Route } from 'react-router-dom'
import s from './s.module.scss'
import Shelf from './shelf'
import Focu from './focu'

export default function Stage() {
	return (
		<div className={s.Stage}>
			<HashRouter>
				<Switch>
					<Route exact path="/focu" component={Focu}></Route>
					<Route exact path="*" component={Shelf}></Route>
				</Switch>
			</HashRouter>
		</div>
	)
}
