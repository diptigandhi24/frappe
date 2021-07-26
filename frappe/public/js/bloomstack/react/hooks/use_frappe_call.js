import { useEffect, useState, useCallback } from 'react';

export const useFrappeCall = (method, args, callback, deps) => {
  useEffect(
    useCallback(async () => {
      try {
        const r = await frappe.call(method, args);
        callback(r, undefined);
      } catch (err) {
        console.error(err);
        callback(undefined, err);
      }
    }, deps || []),
    deps || []);
}