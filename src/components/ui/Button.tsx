import type { ComponentPropsWithoutRef } from 'react'
import { Link } from 'react-router-dom'
import type { LinkProps } from 'react-router-dom'
import { cx } from '../../utils/cx'
import css from './Button.module.css'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'
type ButtonSize = 'md' | 'lg'

interface ButtonBaseProps {
  variant?: ButtonVariant
  size?: ButtonSize
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  ...rest
}: ButtonBaseProps & ComponentPropsWithoutRef<'button'>) {
  return (
    <button type="button" className={cx(css.button, css[variant], css[size], className)} {...rest} />
  )
}

export function ButtonLink({
  variant = 'primary',
  size = 'md',
  className,
  ...rest
}: ButtonBaseProps & LinkProps & Omit<ComponentPropsWithoutRef<'a'>, 'href'>) {
  return <Link className={cx(css.button, css[variant], css[size], className)} {...rest} />
}

export function ButtonAnchor({
  variant = 'primary',
  size = 'md',
  className,
  ...rest
}: ButtonBaseProps & ComponentPropsWithoutRef<'a'>) {
  return <a className={cx(css.button, css[variant], css[size], className)} {...rest} />
}
