import React from "react";
import {Action, State} from "./reducer";
import {useDispatch, useSelector} from "react-redux";

export function useLoadingStatus(identifier: string = "global"): boolean {
    return useSelector((state: State) => state.loading[identifier] > 0);
}

/**
 * For actions like:
 * *foo(a: number, b: string, c: boolean): SagaIterator {..}
 *
 * useModuleAction(foo) will return:
 * (a: number, b: string, c: boolean) => void;
 *
 * useModuleAction(foo, 100) will return:
 * (b: string, c: boolean) => void;
 *
 * useModuleAction(foo, 100, "") will return:
 * (c: boolean) => void;
 *
 * useModuleAction(foo, 100, "", true) will return:
 * () => void;
 */
export function useModuleAction<T extends Array<string | number | boolean | null | undefined>, U extends any[]>(actionCreator: (...args: [...T, ...U]) => Action<[...T, ...U]>, ...deps: T): (...args: U) => void {
    const dispatch = useDispatch();
    return React.useCallback((...args: U) => dispatch(actionCreator(...deps, ...args)), [dispatch, actionCreator, ...deps]);
}

/**
 * For actions like:
 * *foo(data: {key: number}): SagaIterator {..}
 *
 * useModuleObjectAction(foo, "key") will return:
 * (objectValue: number) => void;
 */
export function useModuleObjectAction<T extends object, K extends keyof T>(actionCreator: (arg: T) => Action<[T]>, objectKey: K): (objectValue: T[K]) => void {
    const dispatch = useDispatch();
    return React.useCallback((objectValue: T[K]) => dispatch(actionCreator({[objectKey]: objectValue} as T)), [dispatch, actionCreator, objectKey]);
}
