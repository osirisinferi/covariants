import React, { useCallback, useMemo } from 'react'

import {
  Button,
  CardBody as CardBodyBase,
  Col,
  Container,
  Form as FormBase,
  FormGroup as FormGroupBase,
  Input,
  Label,
  Row,
} from 'reactstrap'
import { getContinents, getCountries, Places } from 'src/io/getPlaces'
import styled, { useTheme } from 'styled-components'

import type { CountryFlagProps } from 'src/components/Common/CountryFlag'
import { getCountryColor, getCountryStrokeDashArray } from 'src/io/getCountryColor'
import { CardCollapsible } from 'src/components/Common/CardCollapsible'
import { ColoredHorizontalLineIcon } from '../Common/ColoredHorizontalLineIcon'

export const CardBody = styled(CardBodyBase)``

export const FormGroup = styled(FormGroupBase)`
  flex: 1 0 320px;
`

export const Form = styled(FormBase)`
  display: flex;
  flex-wrap: wrap;
`

const FlagAlignment = styled.span`
  display: inline-flex;
  align-items: center;
  margin-left: 0.25em;
  > * + * {
    margin-left: 0.5em;
  }
`

export interface IconOrLineComponentProps {
  country: string
  Icon?: React.ComponentType<CountryFlagProps>
}

export function IconComponent({ country, Icon }: IconOrLineComponentProps) {
  return (
    <FlagAlignment>
      {Icon && <Icon country={country} withFallback />}
      <span>{country}</span>
    </FlagAlignment>
  )
}
export function LineComponent({ country }: IconOrLineComponentProps) {
  const theme = useTheme()
  const { stroke, strokeDasharray } = useMemo(() => {
    return {
      stroke: getCountryColor(country),
      strokeDasharray: getCountryStrokeDashArray(country),
    }
  }, [country])

  return (
    <>
      <ColoredHorizontalLineIcon
        width={theme.plot.country.legend.lineIcon.width}
        height={theme.plot.country.legend.lineIcon.height}
        stroke={stroke}
        strokeWidth={theme.plot.country.legend.lineIcon.thickness}
        strokeDasharray={strokeDasharray}
      />
      <span className="ml-2">{country}</span>
    </>
  )
}

export interface CountryFilterCheckboxProps {
  country: string
  enabled: boolean
  withIcons?: boolean
  Icon?: React.ComponentType<CountryFlagProps>
  onFilterChange(country: string): void
}

export function CountryFilterCheckbox({
  country,
  enabled,
  withIcons,
  Icon,
  onFilterChange,
}: CountryFilterCheckboxProps) {
  const onChange = useCallback(() => onFilterChange(country), [country, onFilterChange])
  const IconOrLine = useMemo(() => (withIcons ? IconComponent : LineComponent), [withIcons])

  return (
    <FormGroup check>
      <Label htmlFor={CSS.escape(country)} check>
        <Input id={CSS.escape(country)} type="checkbox" checked={enabled} onChange={onChange} />
        <IconOrLine Icon={Icon} country={country} />
      </Label>
    </FormGroup>
  )
}

export interface CountryFiltersProps {
  places: Places
  regionsTitle: string
  collapsed: boolean
  withIcons?: boolean
  Icon?: React.ComponentType<CountryFlagProps>
  onFilterChange(country: string): void
  onFilterSelectRegion(regionName: string): void
  onFilterSelectAll(): void
  onFilterDeselectAll(): void
  setCollapsed(collapsed: boolean): void
}

export function CountryFilters({
  places,
  regionsTitle,
  collapsed,
  withIcons,
  Icon,
  onFilterSelectRegion,
  onFilterSelectAll,
  onFilterDeselectAll,
  onFilterChange,
  setCollapsed,
}: CountryFiltersProps) {
  const countries = useMemo(() => getCountries(places), [places])
  const continents = useMemo(() => getContinents(places), [places])

  return (
    <CardCollapsible className="m-2" title={regionsTitle} collapsed={collapsed} setCollapsed={setCollapsed}>
      <CardBody>
        <Container fluid>
          <Row noGutters>
            <Col className="d-flex">
              <FormGroup className="flex-grow-0 mx-auto">
                <Button type="button" color="link" onClick={onFilterSelectAll}>
                  {'Select all'}
                </Button>
                <Button type="button" color="link" onClick={onFilterDeselectAll}>
                  {'Deselect all'}
                </Button>
              </FormGroup>
            </Col>
          </Row>

          <Row noGutters className="pb-3 pt-3 border-bottom border-top">
            <Col className="d-flex">
              <Form>
                {continents.map(({ continentName, enabled }) => {
                  return (
                    <CountryFilterCheckbox
                      key={continentName}
                      country={continentName}
                      enabled={enabled}
                      withIcons
                      Icon={Icon}
                      onFilterChange={() => onFilterSelectRegion(continentName)}
                    />
                  )
                })}
              </Form>
            </Col>
          </Row>

          <Row noGutters className="mt-3">
            <Col>
              <Form>
                {countries.map(({ countryName, enabled }) => (
                  <CountryFilterCheckbox
                    key={countryName}
                    country={countryName}
                    enabled={enabled}
                    withIcons={withIcons}
                    Icon={Icon}
                    onFilterChange={onFilterChange}
                  />
                ))}
              </Form>
            </Col>
          </Row>
        </Container>
      </CardBody>
    </CardCollapsible>
  )
}
