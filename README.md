# mplex

Command line interface to the Metaplex SDK.

## Examples

### Preparation

In order to get the same output that is shown in the below examples please export the `DEBUG`
variable in the same terminal that you run the below commands in via:

```sh
export DEBUG=mplex:(info|error)
```

In Windows Powershell please run the below instead:

```sh
$env:DEBUG = 'mplex:(info|error)'
```

### Airdrop

```sh
❯ mplex airdrop A15Y2eoMNGeX4516TYTaaMErwabCrf9AB9mrzFohdQJz 10
  mplex:info Dropping 10SOL to A15Y2eoMNG... on devnet (https://api.devnet.solana.com) +0ms
```
(_defaults to drop to devnet_)

#### Specify local Cluster via Flag

(_requires [amman] to be running in another terminal_)

```sh
❯ mplex airdrop A15Y2eoMNGeX4516TYTaaMErwabCrf9AB9mrzFohdQJz 10 --cluster=local
  mplex:info Dropping 10SOL to A15Y2eoMNG... on local (http://127.0.0.1:8899) +0ms
```

#### Exporting MPLEX_CLUSTER in Current Terminal

```sh
❯ export MPLEX_CLUSTER=local
❯ mplex airdrop A15Y2eoMNGeX4516TYTaaMErwabCrf9AB9mrzFohdQJz 10
  mplex:info Dropping 10SOL to A15Y2eoMNG... on local (http://127.0.0.1:8899) +0ms
```

<!-- Links -->

[amman]:https://github.com/metaplex-foundation/amman
